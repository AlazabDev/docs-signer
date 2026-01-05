import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DaftraDocument = Record<string, any>;

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const daftraApiKey = Deno.env.get("DAFTRA_API_KEY");
    const daftraSubdomain = Deno.env.get("DAFTRA_SUBDOMAIN");

    if (!daftraApiKey || !daftraSubdomain) {
      console.error("Missing Daftra credentials");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Daftra API credentials not configured",
          message: "Please add DAFTRA_API_KEY and DAFTRA_SUBDOMAIN secrets" 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Clean up subdomain - extract just the subdomain if a full URL was provided
    let cleanSubdomain = daftraSubdomain.trim();
    // Remove protocol if present
    cleanSubdomain = cleanSubdomain.replace(/^https?:\/\//i, '');
    // Remove .daftra.com and anything after if present
    cleanSubdomain = cleanSubdomain.replace(/\.daftra\.com.*$/i, '');
    // Remove any trailing slashes
    cleanSubdomain = cleanSubdomain.replace(/\/+$/, '');
    
    console.log(`Cleaned subdomain: ${cleanSubdomain} (original: ${daftraSubdomain})`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body for options
    let documentType = "invoices";
    let page = 1;
    let limit = 50;
    
    try {
      const body = await req.json();
      documentType = body.type || "invoices";
      page = body.page || 1;
      limit = body.limit || 50;
    } catch {
      // Use defaults if no body
    }

    console.log(`Syncing ${documentType} from Daftra (page ${page}, limit ${limit})`);

    // Fetch from Daftra API
    const daftraUrl = `https://${cleanSubdomain}.daftra.com/api2/${documentType}?page=${page}&limit=${limit}`;
    
    const daftraResponse = await fetch(daftraUrl, {
      method: "GET",
      headers: {
        "APIKEY": daftraApiKey,
        "Accept": "application/json",
      },
    });

    if (!daftraResponse.ok) {
      const errorText = await daftraResponse.text();
      console.error("Daftra API error:", errorText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to fetch from Daftra",
          details: errorText
        }),
        { 
          status: daftraResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const daftraData = await daftraResponse.json();
    console.log("Raw Daftra response:", JSON.stringify(daftraData).substring(0, 500));
    
    // Handle Daftra API response structure
    let documents: DaftraDocument[] = [];
    
    // Daftra returns data in format: { "Invoice": {...}, pagination: {...} } or { "Invoices": [{...}] }
    // or array directly
    if (Array.isArray(daftraData)) {
      documents = daftraData;
    } else if (daftraData.data) {
      documents = Array.isArray(daftraData.data) ? daftraData.data : [daftraData.data];
    } else {
      // Try to extract from nested structure like { Invoice: {...} } or { Invoices: [...] }
      const keys = Object.keys(daftraData);
      for (const key of keys) {
        if (key.toLowerCase().includes('invoice') || key.toLowerCase().includes('quote') || key.toLowerCase().includes('estimate')) {
          const value = daftraData[key];
          if (Array.isArray(value)) {
            documents = value;
          } else if (typeof value === 'object' && value !== null) {
            documents = [value];
          }
          break;
        }
      }
    }
    
    console.log(`Received ${documents.length} documents from Daftra`);

    // Map document type
    const typeMap: Record<string, string> = {
      invoices: "invoice",
      quotes: "quote",
      estimates: "estimate",
    };
    const mappedType = typeMap[documentType] || "invoice";

    // Upsert documents into Supabase
    let synced = 0;
    let errors = 0;

    for (const rawDoc of documents) {
      try {
        // Extract invoice/quote data from nested structure
        const doc = rawDoc.Invoice || rawDoc.Quote || rawDoc.Estimate || rawDoc;
        const client = doc.Client || {};
        
        // Build proper document number
        const docNumber = doc.no || doc.number || `${mappedType.toUpperCase()}-${doc.id}`;
        
        // Build client name
        let clientName = "غير محدد";
        if (client.business_name) {
          clientName = client.business_name;
        } else if (client.first_name || client.last_name) {
          clientName = `${client.first_name || ''} ${client.last_name || ''}`.trim();
        } else if (doc.client_business_name) {
          clientName = doc.client_business_name;
        } else if (doc.client_first_name || doc.client_last_name) {
          clientName = `${doc.client_first_name || ''} ${doc.client_last_name || ''}`.trim();
        }
        
        // Extract total amount
        const total = doc.summary_total || doc.total || 0;
        
        // Extract client email
        const clientEmail = client.email || doc.client_email || null;
        
        // Extract URLs
        const pdfUrl = doc.invoice_pdf_url || doc.quote_pdf_url || doc.pdf_url || null;
        const htmlUrl = doc.invoice_html_url || doc.quote_html_url || doc.html_url || null;
        
        console.log(`Processing document: ${docNumber}, client: ${clientName}, total: ${total}`);
        
        const { error } = await supabase
          .from("documents")
          .upsert({
            daftra_id: doc.id?.toString(),
            type: mappedType,
            number: docNumber,
            client_name: clientName,
            client_email: clientEmail,
            total: parseFloat(total) || 0,
            currency: doc.currency_code || "EGP",
            date: doc.date || doc.issue_date || new Date().toISOString().split("T")[0],
            payment_status: mapPaymentStatus(doc.payment_status?.toString()),
            pdf_url: pdfUrl,
            html_url: htmlUrl,
            raw_json: rawDoc,
            synced_at: new Date().toISOString(),
          }, {
            onConflict: "daftra_id",
          });

        if (error) {
          console.error(`Error upserting document ${doc.id}:`, error);
          errors++;
        } else {
          synced++;
        }
      } catch (err) {
        console.error(`Exception processing document:`, err);
        errors++;
      }
    }

    console.log(`Sync complete: ${synced} synced, ${errors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        synced,
        errors,
        total: documents.length,
        type: documentType,
        page,
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: unknown) {
    console.error("Sync error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

function mapPaymentStatus(status?: string): "paid" | "partial" | "unpaid" {
  if (!status) return "unpaid";
  const s = status.toLowerCase();
  if (s.includes("paid") || s.includes("مدفوع")) return "paid";
  if (s.includes("partial") || s.includes("جزئي")) return "partial";
  return "unpaid";
}
