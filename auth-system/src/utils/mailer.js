import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, name, verificationUrl) {
  const host = process.env.EMAIL_SERVER_HOST;
  const port = process.env.EMAIL_SERVER_PORT;
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;
  const from = process.env.EMAIL_FROM || 'no-reply@authsystem.com';

  // Always print verification link in terminal console for dev convenience
  console.log("\n=======================================================");
  console.log(`✉️  EMAIL VERIFICATION LINK FOR: ${email}`);
  console.log(`🔗  LINK: ${verificationUrl}`);
  console.log("=======================================================\n");

  if (!host || !user || !pass) {
    console.warn("⚠️  Email SMTP settings missing. Verification link printed to console above.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port || '587'),
      secure: port === '465',
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: "Verify your email address - AuthSystem",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-top: 0;">Welcome, ${name}!</h2>
          <p style="color: #3f3f46; line-height: 1.5;">Thank you for registering. Please click the button below to verify your email address and activate your account:</p>
          <div style="margin: 24px 0;">
            <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #71717a; font-size: 12px;">If you did not sign up for this account, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
          <p style="color: #a1a1aa; font-size: 10px;">AuthSystem Inc, 123 Tech Boulevard, Suite 500</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("❌ Nodemailer failed to send email, fallback verification link was printed above:", err);
  }
}
