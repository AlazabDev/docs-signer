import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type DocumentAction = 
  | "submit_review"
  | "request_fix"
  | "approve"
  | "sign"
  | "archive"
  | "add_comment"
  | "resolve_comment";

interface ActionRequest {
  action: DocumentAction;
  documentId: string;
  comment?: string;
  signatureData?: string;
  commentId?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify user token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: ActionRequest = await req.json();
    const { action, documentId, comment, signatureData, commentId } = body;

    console.log(`Processing action: ${action} on document ${documentId} by user ${user.id}`);

    // Get user profile for actor name
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, full_name")
      .eq("id", user.id)
      .single();
    
    const actorName = profile?.full_name || profile?.name || user.email || "مستخدم";

    let result;
    let newStatus: string | null = null;

    switch (action) {
      case "submit_review":
        newStatus = "in_review";
        result = await updateDocumentStatus(supabase, documentId, newStatus, user.id, actorName);
        break;

      case "request_fix":
        newStatus = "needs_fix";
        result = await updateDocumentStatus(supabase, documentId, newStatus, user.id, actorName);
        // Add comment with fix request
        if (comment) {
          await addComment(supabase, documentId, user.id, actorName, `طلب تعديل: ${comment}`);
        }
        break;

      case "approve":
        newStatus = "approved";
        result = await updateDocumentStatus(supabase, documentId, newStatus, user.id, actorName);
        break;

      case "sign":
        if (!signatureData) {
          return new Response(
            JSON.stringify({ success: false, error: "Signature data required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        newStatus = "signed";
        result = await signDocument(supabase, documentId, user.id, actorName, signatureData, req);
        break;

      case "archive":
        newStatus = "archived";
        result = await updateDocumentStatus(supabase, documentId, newStatus, user.id, actorName);
        break;

      case "add_comment":
        if (!comment) {
          return new Response(
            JSON.stringify({ success: false, error: "Comment text required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await addComment(supabase, documentId, user.id, actorName, comment);
        break;

      case "resolve_comment":
        if (!commentId) {
          return new Response(
            JSON.stringify({ success: false, error: "Comment ID required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await resolveComment(supabase, commentId, user.id);
        break;

      default:
        return new Response(
          JSON.stringify({ success: false, error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (result.error) {
      return new Response(
        JSON.stringify({ success: false, error: result.error.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        action,
        newStatus,
        data: result.data 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Action error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function updateDocumentStatus(
  supabase: any,
  documentId: string,
  status: string,
  userId: string,
  actorName: string
) {
  const { data, error } = await supabase
    .from("documents")
    .update({ status })
    .eq("id", documentId)
    .select()
    .single();

  if (!error) {
    // Log the action
    await supabase.from("document_audit_logs").insert({
      document_id: documentId,
      actor_id: userId,
      actor_name: actorName,
      action: "status_change",
      new_value: { status },
    });
  }

  return { data, error };
}

async function addComment(
  supabase: any,
  documentId: string,
  userId: string,
  userName: string,
  text: string
) {
  const { data, error } = await supabase
    .from("document_comments")
    .insert({
      document_id: documentId,
      user_id: userId,
      user_name: userName,
      text,
    })
    .select()
    .single();

  if (!error) {
    await supabase.from("document_audit_logs").insert({
      document_id: documentId,
      actor_id: userId,
      actor_name: userName,
      action: "comment_added",
      new_value: { text },
    });
  }

  return { data, error };
}

async function resolveComment(
  supabase: any,
  commentId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("document_comments")
    .update({
      resolved: true,
      resolved_by: userId,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .select()
    .single();

  return { data, error };
}

async function signDocument(
  supabase: any,
  documentId: string,
  userId: string,
  signerName: string,
  signatureData: string,
  req: Request
) {
  // Get client IP
  const ip = req.headers.get("x-forwarded-for") || 
             req.headers.get("cf-connecting-ip") || 
             "unknown";

  // Insert signature record
  const { data: signature, error: sigError } = await supabase
    .from("document_signatures")
    .insert({
      document_id: documentId,
      signer_id: userId,
      signer_name: signerName,
      signature_data: signatureData,
      ip_address: ip,
    })
    .select()
    .single();

  if (sigError) {
    return { data: null, error: sigError };
  }

  // Update document status
  const { data, error } = await supabase
    .from("documents")
    .update({ status: "signed" })
    .eq("id", documentId)
    .select()
    .single();

  if (!error) {
    await supabase.from("document_audit_logs").insert({
      document_id: documentId,
      actor_id: userId,
      actor_name: signerName,
      action: "document_signed",
      metadata: { signature_id: signature.id },
    });
  }

  return { data, error };
}
