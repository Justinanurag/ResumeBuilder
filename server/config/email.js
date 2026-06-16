import nodemailer from "nodemailer";

const getSmtpPort = () => Number(process.env.SMTP_PORT || 587);

const isEmailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );

const createTransporter = () => {
  if (!isEmailConfigured()) return null;

  const port = getSmtpPort();

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const transporter = createTransporter();
  const from = process.env.SENDER_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #111827;">Reset your password</h2>
      <p>Hi ${name || "there"},</p>
      <p>We received a request to reset your Resume Builder password. Click the button below to choose a new password.</p>
      <p style="margin: 28px 0;">
        <a href="${resetUrl}" style="background:#22c55e;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;display:inline-block;">
          Reset Password
        </a>
      </p>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p style="font-size:12px;color:#6b7280;word-break:break-all;">${resetUrl}</p>
    </div>
  `;

  if (!transporter) {
    console.warn("SMTP is not configured. Password reset email was not sent.");
    console.info(`Password reset link for ${to}: ${resetUrl}`);
    return { sent: false, resetUrl };
  }

  await transporter.sendMail({
    from: `"Resume Builder" <${from}>`,
    to,
    subject: "Reset your Resume Builder password",
    html,
    text: `Reset your password using this link (expires in 1 hour): ${resetUrl}`,
  });

  return { sent: true };
};
