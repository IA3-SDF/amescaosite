"use server";

import nodemailer from "nodemailer";

// Typage pour les données du formulaire
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Server Action - Envoyer un email depuis le formulaire de contact
 */
export async function sendContactEmail(
  formDataObject: FormData | ContactFormData,
) {
  try {
    // 1. Extraire les données (FormData ou objet plain)
    let name: string;
    let email: string;
    let message: string;

    if (formDataObject instanceof FormData) {
      name = ((formDataObject.get("name") as string) || "").trim();
      email = ((formDataObject.get("email") as string) || "").trim();
      message = ((formDataObject.get("message") as string) || "").trim();
    } else {
      name = (formDataObject.name || "").trim();
      email = (formDataObject.email || "").trim();
      message = (formDataObject.message || "").trim();
    }

    // Valider les données
    if (!name || !email || !message) {
      return { success: false, error: "Tous les champs sont obligatoires" };
    }

    // Valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Email invalide" };
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpSecure = process.env.SMTP_SECURE === "true";

    console.log("[Contact Email] SMTP env check", {
      smtpHost,
      smtpUser,
      smtpPassSet: Boolean(smtpPass),
      smtpPort: process.env.SMTP_PORT,
      smtpSecure: process.env.SMTP_SECURE,
      smtpFromEmail: process.env.SMTP_FROM_EMAIL,
    });

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("[Contact Email] SMTP configuration missing", {
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass: Boolean(smtpPass),
      });
      return {
        success: false,
        error:
          "La configuration du serveur email est incomplète. Veuillez contacter l'administrateur.",
      };
    }

    // Configuration Nodemailer
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Vérifier la connexion SMTP
    try {
      await transporter.verify();
    } catch (smtpError) {
      console.error("[Contact Email] SMTP verification failed:", smtpError);
      return {
        success: false,
        error:
          "Impossible de se connecter au service d'envoi d'email. Veuillez réessayer plus tard.",
      };
    }

    // Styles CSS réutilisables (Inline-ready)
    const brandColor = "#059669"; // Vert AMESCAO
    const bgLight = "#f8fafc";
    const textDark = "#1e293b";
    const textMuted = "#64748b";

    // OPTIONS : Email pour l'administration AMESCAO
    const mailOptionsToAmescao = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: "amescao2026@gmail.com",
      subject: `🔔 Nouveau message de contact de ${name}`,
      html: `
        <div style="background-color: ${bgLight}; padding: 30px 15px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: ${textDark};">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;">
            
            <!-- Header -->
            <div style="background-color: ${brandColor}; padding: 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">AMESCAO</h1>
              <p style="color: #d1fae5; margin: 5px 0 0 0; font-size: 14px;">Back-office | Formulaire de Contact</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <h2 style="color: ${textDark}; margin-top: 0; font-size: 18px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Détails du message</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 8px 0; color: ${textMuted}; width: 80px; font-weight: bold; font-size: 14px;">Nom :</td>
                  <td style="padding: 8px 0; font-size: 15px; color: ${textDark};">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${textMuted}; font-weight: bold; font-size: 14px;">Email :</td>
                  <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${email}" style="color: ${brandColor}; text-decoration: none; font-weight: 500;">${escapeHtml(email)}</a></td>
                </tr>
              </table>

              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid ${brandColor};">
                <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 12px; text-transform: uppercase; color: ${textMuted}; letter-spacing: 0.5px;">Message :</p>
                <p style="margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; color: #334155;">${escapeHtml(message)}</p>
              </div>

              <!-- Button CTA -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${email}?subject=Réponse AMESCAO" style="background-color: ${brandColor}; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: 600; font-size: 15px; border-radius: 6px; display: inline-block;">Répondre directement</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: ${textMuted}; font-size: 12px; margin: 0;">Cet email automatisé provient du site officiel AMESCAO.</p>
            </div>
          </div>
        </div>
      `,
      text: `Nouveau message de contact\n\nNom: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      replyTo: email,
    };

    // Envoyer l'email à AMESCAO
    const infoToAmescao = await transporter.sendMail(mailOptionsToAmescao);
    console.log(
      "[Contact Email] Email envoyé à AMESCAO:",
      infoToAmescao.messageId,
    );

    // OPTIONS : Email de confirmation au visiteur
    const mailOptionsToVisitor = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: "Nous avons reçu votre message - AMESCAO",
      html: `
        <div style="background-color: ${bgLight}; padding: 30px 15px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: ${textDark};">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;">
            
            <!-- Header -->
            <div style="background-color: ${brandColor}; padding: 30px 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">AMESCAO</h1>
              <p style="color: #d1fae5; margin: 5px 0 0 0; font-size: 14px; letter-spacing: 0.5px;">Accusé de réception</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px; line-height: 1.6;">
              <h2 style="color: ${textDark}; margin-top: 0; font-size: 20px; font-weight: 600;">Merci pour votre message !</h2>
              <p style="font-size: 15px; color: #334155;">Bonjour <strong>${escapeHtml(name)}</strong>,</p>
              <p style="font-size: 15px; color: #334155;">Nous confirmons la bonne réception de votre demande. Notre équipe étudie votre message et reviendra vers vous dans les plus brefs délais.</p>
              
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 25px 0; border: 1px dashed #cbd5e1;">
                <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 12px; color: ${textMuted}; text-transform: uppercase;">Copie de votre message :</p>
                <p style="margin: 0; font-size: 14px; color: #475569; italic; white-space: pre-wrap;">"${escapeHtml(message)}"</p>
              </div>

              <!-- Infos AMESCAO Box -->
              <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #bbf7d0;">
                <h4 style="margin: 0 0 10px 0; color: #166534; font-size: 14px; font-weight: 600; text-transform: uppercase;">Nos Coordonnées</h4>
                <p style="margin: 4px 0; font-size: 14px; color: #166534;">📍 <strong>Localisation :</strong> Canton d'Aouda, Togo</p>
                <p style="margin: 4px 0; font-size: 14px; color: #166534;">📞 <strong>Téléphone :</strong> +228 71 28 08 08</p>
                <p style="margin: 4px 0; font-size: 14px; color: #166534;">✉️ <strong>Email :</strong> amescao2026@gmail.com</p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: ${textMuted}; font-size: 13px; margin: 0 0 5px 0; font-weight: 500;">L'équipe AMESCAO</p>
              <p style="color: ${textMuted}; font-size: 11px; margin: 0;">Ceci est un mail automatique, merci de ne pas y répondre directement.</p>
            </div>
          </div>
        </div>
      `,
      text: `Bonjour ${name},\n\nNous avons bien reçu votre message.\n\nCordialement,\nL'équipe AMESCAO`,
    };

    try {
      const infoToVisitor = await transporter.sendMail(mailOptionsToVisitor);
      console.log(
        "[Contact Email] Email de confirmation envoyé au visiteur:",
        infoToVisitor.messageId,
      );
    } catch (error) {
      console.error(
        "[Contact Email] Erreur lors de l'envoi de la confirmation:",
        error,
      );
    }

    return {
      success: true,
      message: "Votre message a été envoyé avec succès !",
    };
  } catch (error) {
    console.error("[Contact Email] Erreur:", error);
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer plus tard.",
    };
  }
}

/**
 * Échapper les caractères HTML pour éviter les injections
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
