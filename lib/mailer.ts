// lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@vynex.com",
      to,
      subject,
      html,
      text,
    });
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
};

export const sendInvitationEmail = async (email: string, name: string, token: string) => {
  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: "Vous avez été invité à rejoindre Vynex",
    html: `
      <h1>Bienvenue sur Vynex</h1>
      <p>Bonjour ${name},</p>
      <p>Vous avez été invité à rejoindre une entreprise sur Vynex.</p>
      <p>Cliquez sur le lien ci-dessous pour accepter l'invitation :</p>
      <a href="${inviteLink}">${inviteLink}</a>
    `,
  });
};