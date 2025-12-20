import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DaftraDocument {
  id: string;
  number: string;
  client_name: string;
  client_email?: string;
  total: number;
  currency?: string;
  date: string;
  status?: string;
  payment_status?: string;
  pdf_url?: string;
  html_url?: string;
}

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
    const daftraUrl = `https://${daftraSubdomain}.daftra.com/api2/${documentType}?page=${page}&limit=${limit}`;
    
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
    const documents: DaftraDocument[] = daftraData.data || daftraData || [];
    
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

    for (const doc of documents) {
      try {
        const { error } = await supabase
          .from("documents")
          .upsert({
            daftra_id: doc.id?.toString(),
            type: mappedType,
            number: doc.number || `${mappedType.toUpperCase()}-${doc.id}`,
            client_name: doc.client_name || "غير محدد",
            client_email: doc.client_email,
            total: doc.total || 0,
            currency: doc.currency || "EGP",
            date: doc.date || new Date().toISOString().split("T")[0],
            payment_status: mapPaymentStatus(doc.payment_status),
            pdf_url: doc.pdf_url,
            html_url: doc.html_url,
            raw_json: doc,
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
        console.error(`Exception processing document ${doc.id}:`, err);
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
