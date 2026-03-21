import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = "3dbotics.LC@gmail.com";

function createTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.warn("[Email] GMAIL_USER or GMAIL_APP_PASSWORD env vars not set. Emails will not be sent.");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });
}

export async function sendContactEmail(name: string, email: string, message: string): Promise<void> {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn("[Email] Skipping email send — transporter not configured.");
    return;
  }

  const mailOptions = {
    from: `"3DBotics Website" <${process.env.GMAIL_USER}>`,
    to: RECIPIENT_EMAIL,
    replyTo: email,
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
  };

  await transporter.sendMail(mailOptions);
  console.log(`[Email] Contact form email sent to ${RECIPIENT_EMAIL} from ${email}`);
}
