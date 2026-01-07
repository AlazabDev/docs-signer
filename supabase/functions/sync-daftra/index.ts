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
    let documentType = "estimates"; // افتراضياً نسحب عروض الأسعار (estimates في دفترة)
    let page = 1;
    let limit = 50;
    
    try {
      const body = await req.json();
      // Map user-friendly names to Daftra API endpoints
      const typeMapping: Record<string, string> = {
        quotes: "estimates",      // عروض الأسعار = estimates
        estimates: "estimates",   
        invoices: "invoices",     // الفواتير
      };
      const requestedType = body.type || "estimates";
      documentType = typeMapping[requestedType] || requestedType;
      page = body.page || 1;
      limit = body.limit || 50;
    } catch {
      // Use defaults if no body
    }

    console.log(`Syncing ${documentType} from Daftra (page ${page}, limit ${limit})`);

    // Fetch list from Daftra API
    const daftraListUrl = `https://${cleanSubdomain}.daftra.com/api2/${documentType}?page=${page}&limit=${limit}`;
    console.log(`Calling Daftra API: ${daftraListUrl}`);
    
    const daftraResponse = await fetch(daftraListUrl, {
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

    // Helper function to fetch single document with items
    async function fetchDocumentDetails(docId: string): Promise<DaftraDocument | null> {
      try {
        const detailUrl = `https://${cleanSubdomain}.daftra.com/api2/${documentType}/${docId}`;
        console.log(`Fetching document details: ${detailUrl}`);
        
        const response = await fetch(detailUrl, {
          method: "GET",
          headers: {
            "APIKEY": daftraApiKey!,
            "Accept": "application/json",
          },
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch document ${docId}: ${response.status}`);
          return null;
        }
        
        const data = await response.json();
        return data.data || data;
      } catch (err) {
        console.error(`Error fetching document ${docId}:`, err);
        return null;
      }
    }

    // Upsert documents into Supabase
    let synced = 0;
    let itemsSynced = 0;
    let errors = 0;

    for (const rawDoc of documents) {
      try {
        // Daftra wraps each item: {Estimate: {id: 314, no: "...", Client: {...}, ...}}
        const listDoc = rawDoc.Quote || rawDoc.Invoice || rawDoc.Estimate || rawDoc;
        
        // Validate we have an ID
        if (!listDoc.id) {
          console.log("Skipping document without id:", JSON.stringify(rawDoc).substring(0, 200));
          continue;
        }
        
        const daftraId = listDoc.id.toString();
        
        // ✅ جلب المستند الكامل مع العناصر من الـ API
        const fullDocData = await fetchDocumentDetails(daftraId);
        
        // استخدم البيانات الكاملة إن وجدت، وإلا استخدم بيانات القائمة
        const doc = fullDocData?.Estimate || fullDocData?.Invoice || fullDocData?.Quote || fullDocData || listDoc;
        const client = doc.Client || {};
        
        // ✅ العناصر تأتي كـ InvoiceItem في الـ single document response
        const items = doc.InvoiceItem || doc.QuoteItem || doc.EstimateItem || [];
        
        console.log(`Document ${daftraId} has ${items.length} items`);
        
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
        const pdfUrl = doc.invoice_pdf_url || doc.quote_pdf_url || doc.pdf_url || null;
        const htmlUrl = doc.invoice_html_url || doc.quote_html_url || doc.html_url || null;
        
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
            raw_json: fullDocData || rawDoc,
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
        
        // ✅ Sync items if present
        if (Array.isArray(items) && items.length > 0 && docData?.id) {
          // First, delete existing items for this document to avoid duplicates
          await supabase
            .from("quote_items")
            .delete()
            .eq("document_id", docData.id);
          
          for (const item of items) {
            const itemId = item.id?.toString() || null;
            
            // Extract item name - Daftra uses 'item' field for product name
            const productName = item.item || item.product || item.name || item.description || "منتج/خدمة";
            
            const itemData = {
              document_id: docData.id,
              daftra_item_id: itemId,
              product_name: productName,
              product_description: item.description || null,
              quantity: parseFloat(item.quantity) || 1,
              unit_price: parseFloat(item.unit_price) || 0,
              total_price: parseFloat(item.subtotal) || (parseFloat(item.quantity) * parseFloat(item.unit_price)) || 0,
              notes: item.notes || null,
            };
            
            console.log(`  Item: ${productName} | Qty: ${itemData.quantity} | Price: ${itemData.unit_price}`);
            
            const { error: itemError } = await supabase
              .from("quote_items")
              .insert(itemData);
            
            if (itemError) {
              console.error(`Error inserting item:`, itemError.message);
            } else {
              itemsSynced++;
            }
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
