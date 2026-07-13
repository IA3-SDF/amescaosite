"use server";

import nodemailer from "nodemailer";

interface BulkEmailData {
  recipients: Array<{ id: string; email: string; name: string }>;
  subject: string;
  htmlContent: string;
}

interface SendResult {
  success: boolean;
  sent: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
  message: string;
}

// ── Couleurs et variables de la charte AMESCAO ──
const BRAND_COLORS = {
  primary: "#059669", // Vert AMESCAO
  primaryDark: "#047857", // Vert foncé
  bg: "#f8fafc", // Fond très clair
  card: "#ffffff", // Blanc card
  border: "#e2e8f0", // Bordure douce
  textDark: "#1e293b", // Texte principal
  textMuted: "#64748b", // Texte secondaire
  bgLight: "#f1f5f9", // Fond léger
  accent: "#ecfdf5", // Accent vert clair
};

/**
 * Enveloppe le contenu Quill dans un template email professionnel
 */
function wrapEmailTemplate(
  subject: string,
  htmlContent: string,
  recipientName: string,
): string {
  return `
    <div style="background-color: ${BRAND_COLORS.bg}; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: ${BRAND_COLORS.textDark};">
      <div style="max-width: 600px; margin: 0 auto; background-color: ${BRAND_COLORS.card}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border: 1px solid ${BRAND_COLORS.border};">
        
        <!-- Header avec branding -->
        <div style="background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            AMESCAO
          </h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">
            Votre partenaire de confiance au Togo
          </p>
        </div>

        <!-- Contenu principal -->
        <div style="padding: 40px 30px;">
          
          <!-- Titre principal (du sujet) -->
          <h2 style="margin: 0 0 24px 0; color: ${BRAND_COLORS.textDark}; font-size: 24px; font-weight: 700; letter-spacing: -0.3px; line-height: 1.3;">
            ${escapeHtml(subject)}
          </h2>

          <!-- Salutation personnalisée -->
          <p style="margin: 0 0 24px 0; font-size: 15px; color: ${BRAND_COLORS.textDark}; line-height: 1.8;">
            Bonjour <strong>${escapeHtml(recipientName)}</strong>,
          </p>

          <!-- Contenu fourni par l'administrateur -->
          <div style="color: #475569; font-size: 15px; line-height: 1.8; margin-bottom: 28px;">
            ${htmlContent}
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #1e293b; padding: 30px; text-align: center;">
          
          <!-- Informations de contact -->
          <div style="margin-bottom: 18px;">
            <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px;">
              <strong style="color: #e2e8f0;">AMESCAO</strong> — Canton d'Aouda, Togo
            </p>
            <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px;">
              📞 <a href="tel:+22871280808" style="color: ${BRAND_COLORS.primary}; text-decoration: none; font-weight: 600;">+228 71 28 08 08</a>
            </p>
            <p style="margin: 0; color: #94a3b8; font-size: 13px;">
              © 2026 AMESCAO. Tous droits réservés.
            </p>
          </div>

          <!-- Message légal RGPD -->
          <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #334155;">
            <p style="margin: 0; color: #64748b; font-size: 11px; line-height: 1.5;">
              Vous recevez cet email car vous êtes inscrit auprès d'AMESCAO. Vos données sont protégées conformément à nos politiques de confidentialité.
            </p>
          </div>
        </div>

      </div>
      <div style="height: 20px;"></div>
    </div>
  `;
}

/**
 * Échappe les caractères HTML pour éviter les injections
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

/**
 * Supprime les tags HTML pour obtenir du texte brut
 */
function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

/**
 * Server Action - Envoyer un email en masse aux utilisateurs
 */
export async function sendBulkEmail(data: BulkEmailData): Promise<SendResult> {
  const result: SendResult = {
    success: false,
    sent: 0,
    failed: 0,
    errors: [],
    message: "",
  };

  try {
    // Validation
    if (!data.recipients || data.recipients.length === 0) {
      return {
        ...result,
        success: false,
        message: "Aucun destinataire sélectionné",
      };
    }

    if (!data.subject || !data.subject.trim()) {
      return {
        ...result,
        success: false,
        message: "Veuillez fournir un objet",
      };
    }

    if (!data.htmlContent || !data.htmlContent.trim()) {
      return {
        ...result,
        success: false,
        message: "Le contenu du mail est vide",
      };
    }

    // Configuration Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Vérifier la connexion SMTP
    await transporter.verify();

    // Envoyer les emails
    for (const recipient of data.recipients) {
      try {
        // Envelopper le contenu dans le template professionnel
        const wrappedHtml = wrapEmailTemplate(
          data.subject,
          data.htmlContent,
          recipient.name,
        );

        const mailOptions = {
          from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
          to: recipient.email,
          subject: data.subject,
          html: wrappedHtml,
          text: stripHtmlTags(data.htmlContent),
          replyTo: "support@amescao.tg",
        };

        await transporter.sendMail(mailOptions);
        result.sent++;

        console.log(`[Bulk Email] Email envoyé à ${recipient.email}`);

        // Petit délai pour éviter le spam
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Erreur inconnue";
        result.failed++;
        result.errors.push({
          email: recipient.email,
          error: errorMessage,
        });
        console.error(
          `[Bulk Email] Erreur lors de l'envoi à ${recipient.email}:`,
          error,
        );
      }
    }

    result.success = result.failed === 0;
    result.message =
      result.failed === 0
        ? `${result.sent} email(s) envoyé(s) avec succès`
        : `${result.sent} email(s) envoyé(s), ${result.failed} erreur(s)`;

    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur serveur";
    console.error("[Bulk Email] Erreur générale:", error);
    return {
      success: false,
      sent: 0,
      failed: data.recipients?.length || 0,
      errors: [{ email: "tous", error: errorMessage }],
      message: `Erreur lors de l'envoi des emails: ${errorMessage}`,
    };
  }
}
