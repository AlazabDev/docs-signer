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

    // Clean up subdomain
    let cleanSubdomain = daftraSubdomain.trim();
    cleanSubdomain = cleanSubdomain.replace(/^https?:\/\//i, '');
    cleanSubdomain = cleanSubdomain.replace(/\.daftra\.com.*$/i, '');
    cleanSubdomain = cleanSubdomain.replace(/\/+$/, '');
    
    console.log(`Cleaned subdomain: ${cleanSubdomain}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body for options
    let documentType = "quotes"; // افتراضياً نسحب عروض الأسعار
    let page = 1;
    let limit = 50;
    
    try {
      const body = await req.json();
      documentType = body.type || "quotes";
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
    console.log("Daftra response keys:", Object.keys(daftraData));
    
    // Handle Daftra API response
    let documents: DaftraDocument[] = [];
    
    if (Array.isArray(daftraData)) {
      documents = daftraData;
    } else if (daftraData.data && Array.isArray(daftraData.data)) {
      documents = daftraData.data;
    } else {
      const keys = Object.keys(daftraData).filter(k => 
        k.toLowerCase().includes('invoice') || 
        k.toLowerCase().includes('quote') || 
        k.toLowerCase().includes('estimate')
      );
      if (keys.length > 0) {
        const value = daftraData[keys[0]];
        documents = Array.isArray(value) ? value : [{ [keys[0]]: value }];
      }
    }
    
    console.log(`Found ${documents.length} documents to sync`);

    // Map document type
    const typeMap: Record<string, string> = {
      invoices: "invoice",
      quotes: "quote",
      estimates: "estimate",
    };
    const mappedType = typeMap[documentType] || "quote";

    // Upsert documents into Supabase
    let synced = 0;
    let itemsSynced = 0;
    let errors = 0;

    for (const rawDoc of documents) {
      try {
        // Daftra wraps each item: {Quote: {id: 314, no: "...", Client: {...}, QuoteItem: [...], ...}}
        const doc = rawDoc.Quote || rawDoc.Invoice || rawDoc.Estimate || rawDoc;
        const client = doc.Client || {};
        const items = doc.QuoteItem || doc.InvoiceItem || doc.EstimateItem || [];
        
        // Validate we have an ID
        if (!doc.id) {
          console.log("Skipping document without id:", JSON.stringify(rawDoc).substring(0, 200));
          continue;
        }
        
        const daftraId = doc.id.toString();
        
        // Build document number
        const docNumber = doc.no || doc.number || `${mappedType.toUpperCase()}-${daftraId}`;
        
        // Build client name
        let clientName = "غير محدد";
        if (doc.client_business_name && doc.client_business_name.trim()) {
          clientName = doc.client_business_name;
        } else if (client.business_name && client.business_name.trim()) {
          clientName = client.business_name;
        } else if (doc.client_first_name || doc.client_last_name) {
          clientName = `${doc.client_first_name || ''} ${doc.client_last_name || ''}`.trim() || "غير محدد";
        } else if (client.first_name || client.last_name) {
          clientName = `${client.first_name || ''} ${client.last_name || ''}`.trim() || "غير محدد";
        }
        
        // Extract total
        const total = parseFloat(doc.summary_total) || parseFloat(doc.total) || 0;
        
        // Extract client email
        const clientEmail = doc.client_email || client.email || null;
        
        // Extract URLs
        const pdfUrl = doc.quote_pdf_url || doc.invoice_pdf_url || doc.pdf_url || null;
        const htmlUrl = doc.quote_html_url || doc.invoice_html_url || doc.html_url || null;
        
        // Map payment status
        let paymentStatus: "paid" | "partial" | "unpaid" = "unpaid";
        const paymentStatusNum = parseInt(doc.payment_status);
        if (paymentStatusNum === 2 || doc.payment_status === "paid") {
          paymentStatus = "paid";
        } else if (paymentStatusNum === 1 || doc.payment_status === "partial") {
          paymentStatus = "partial";
        }
        
        console.log(`Syncing: ${docNumber} | Client: ${clientName} | Total: ${total} | Items: ${items.length}`);
        
        // Upsert document
        const { data: docData, error: docError } = await supabase
          .from("documents")
          .upsert({
            daftra_id: daftraId,
            type: mappedType,
            number: docNumber,
            client_name: clientName,
            client_email: clientEmail,
            total: total,
            currency: doc.currency_code || "EGP",
            date: doc.date || doc.issue_date || new Date().toISOString().split("T")[0],
            payment_status: paymentStatus,
            pdf_url: pdfUrl,
            html_url: htmlUrl,
            raw_json: rawDoc,
            synced_at: new Date().toISOString(),
          }, {
            onConflict: "daftra_id",
          })
          .select('id')
          .single();

        if (docError) {
          console.error(`Error upserting document ${daftraId}:`, docError.message);
          errors++;
          continue;
        }
        
        synced++;
        
        // Sync quote items if present
        if (Array.isArray(items) && items.length > 0 && docData?.id) {
          for (const item of items) {
            const itemId = item.id?.toString() || null;
            
            // Check if item exists
            const { data: existingItem } = await supabase
              .from("quote_items")
              .select("id")
              .eq("document_id", docData.id)
              .eq("daftra_item_id", itemId)
              .maybeSingle();
            
            const itemData = {
              document_id: docData.id,
              daftra_item_id: itemId,
              product_name: item.product || item.name || item.description || "منتج/خدمة",
              product_description: item.description || item.notes || null,
              quantity: parseFloat(item.quantity) || 1,
              unit_price: parseFloat(item.unit_price) || parseFloat(item.price) || 0,
              total_price: parseFloat(item.total) || (parseFloat(item.quantity) * parseFloat(item.unit_price)) || 0,
              notes: item.notes || null,
            };
            
            if (existingItem) {
              // Update existing item (keep approval status)
              await supabase
                .from("quote_items")
                .update({
                  product_name: itemData.product_name,
                  product_description: itemData.product_description,
                  quantity: itemData.quantity,
                  unit_price: itemData.unit_price,
                  total_price: itemData.total_price,
                  notes: itemData.notes,
                })
                .eq("id", existingItem.id);
            } else {
              // Insert new item
              await supabase
                .from("quote_items")
                .insert(itemData);
            }
            
            itemsSynced++;
          }
        }
      } catch (err) {
        console.error(`Exception:`, err);
        errors++;
      }
    }

    console.log(`Sync complete: ${synced} docs, ${itemsSynced} items, ${errors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        synced,
        itemsSynced,
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
