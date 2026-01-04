import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendReviewEmailRequest {
  documentId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerEmail: string;
  documentTitle: string;
  senderName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured - emails will be skipped");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email service not configured",
          message: "RESEND_API_KEY is not set. Please configure it in Supabase secrets."
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: SendReviewEmailRequest = await req.json();
    const { documentId, reviewerId, reviewerName, reviewerEmail, documentTitle, senderName } = body;

    // Get reviewer access hash for the review link
    const { data: reviewer, error: reviewerError } = await supabase
      .from("document_reviewers")
      .select("access_hash")
      .eq("id", reviewerId)
      .single();

    if (reviewerError || !reviewer) {
      console.error("Reviewer not found:", reviewerError);
      return new Response(
        JSON.stringify({ success: false, error: "Reviewer not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const reviewLink = `${Deno.env.get("SITE_URL") || "https://alazab-docs.lovable.app"}/review/${documentId}?token=${reviewer.access_hash}`;

    // Send email using Resend HTTP API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Al Azab Docs <noreply@alazab.com>",
        to: [reviewerEmail],
        subject: `طلب مراجعة مستند: ${documentTitle}`,
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, sans-serif; line-height: 1.8; color: #333; direction: rtl; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
              .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .btn { display: inline-block; background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>طلب مراجعة مستند</h1>
              </div>
              <div class="content">
                <p>مرحباً ${reviewerName}،</p>
                <p>تم إرسال مستند جديد لك للمراجعة والاعتماد من قبل <strong>${senderName || "النظام"}</strong>.</p>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>عنوان المستند:</strong> ${documentTitle}</p>
                </div>
                
                <p>يرجى مراجعة المستند واتخاذ الإجراء المناسب:</p>
                
                <center>
                  <a href="${reviewLink}" class="btn">مراجعة المستند</a>
                </center>
                
                <p style="color: #666; font-size: 14px;">
                  إذا لم تتمكن من النقر على الزر، يمكنك نسخ الرابط التالي ولصقه في المتصفح:<br>
                  <a href="${reviewLink}" style="word-break: break-all;">${reviewLink}</a>
                </p>
              </div>
              <div class="footer">
                <p>هذا البريد تم إرساله تلقائياً من نظام إدارة المستندات</p>
                <p>© ${new Date().getFullYear()} Al Azab - جميع الحقوق محفوظة</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Failed to send email:", emailResult);
      return new Response(
        JSON.stringify({ success: false, error: emailResult.message || "Failed to send email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Email sent successfully:", emailResult);

    // Update reviewer to mark email as sent
    await supabase
      .from("document_reviewers")
      .update({ status: "email_sent" })
      .eq("id", reviewerId);

    return new Response(
      JSON.stringify({ success: true, data: emailResult }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
