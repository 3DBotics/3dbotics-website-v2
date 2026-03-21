import { Resend } from "resend";

const RECIPIENT_EMAIL = "3dbotics.LC@gmail.com";

export async function sendContactEmail(name: string, email: string, message: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY env var not set. Emails will not be sent.");
    return;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "3DBotics Website <onboarding@resend.dev>",
    to: [RECIPIENT_EMAIL],
    reply_to: email,
    subject: `New Contact Form Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #7DD3D8; border-radius: 12px;">
        <div style="background-color: #7DD3D8; padding: 16px 20px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
          <h2 style="margin: 0; color: #1a5a5a; font-size: 20px;">New Message from 3DBotics Website</h2>
        </div>
        <p style="color: #555; margin-bottom: 6px;"><strong>Name:</strong> ${name}</p>
        <p style="color: #555; margin-bottom: 6px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #7DD3D8;">${email}</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p style="color: #555; margin-bottom: 6px;"><strong>Message:</strong></p>
        <p style="color: #333; background: #f9f9f9; padding: 14px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p style="color: #aaa; font-size: 12px;">This message was sent via the contact form on <a href="https://3dbotics.ph" style="color: #7DD3D8;">3dbotics.ph</a></p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }

  console.log(`[Email] Contact form email sent to ${RECIPIENT_EMAIL} from ${email}`);
}
