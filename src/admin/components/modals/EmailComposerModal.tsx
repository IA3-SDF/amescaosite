"use client";

import { sendBulkEmail } from "@/src/actions/sendBulkEmail";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Send, X } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import "react-quill-new/dist/quill.snow.css";

interface Recipient {
  id: string;
  email: string;
  name: string;
}

interface EmailComposerModalProps {
  recipients: Recipient[];
  onClose: () => void;
}

interface ReactQuillComponentProps {
  value: string;
  onChange: (content: string) => void;
  modules: {
    toolbar: Array<unknown>;
  };
  formats: string[];
  theme: "snow";
  placeholder: string;
  readOnly: boolean;
  className?: string;
}

interface BulkEmailError {
  email: string;
  error: string;
}

type SendBulkEmailResult = {
  success: boolean;
  sent: number;
  failed: number;
  errors: BulkEmailError[];
  message: string;
} | null;

const ReactQuill = dynamic<ReactQuillComponentProps>(
  () =>
    import("react-quill-new").then(
      (mod) =>
        mod.default as unknown as React.ComponentType<ReactQuillComponentProps>,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 animate-pulse rounded-xl bg-neutral-100" />
    ),
  },
);

type SendStatus = "idle" | "sending" | "success" | "error";

function EmailComposerModalComponent({
  recipients,
  onClose,
}: EmailComposerModalProps) {
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(
    new Set(),
  );
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sendResult, setSendResult] = useState<SendBulkEmailResult>(null);

  const isAllSelected = selectedRecipients.size === recipients.length;
  const selectedCount = selectedRecipients.size;

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "blockquote"],
        ["clean"],
      ],
    }),
    [],
  );

  const quillFormats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "align",
      "link",
      "blockquote",
    ],
    [],
  );

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedRecipients(new Set());
    } else {
      setSelectedRecipients(new Set(recipients.map((r) => r.id)));
    }
  }, [isAllSelected, recipients]);

  const toggleRecipient = useCallback((id: string) => {
    setSelectedRecipients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSend = useCallback(async () => {
    if (selectedCount === 0 || !subject.trim() || !htmlContent.trim()) return;

    setSendStatus("sending");
    setErrorMessage("");
    setSuccessMessage("");
    setSendResult(null);

    try {
      const targetRecipients = recipients.filter((r) =>
        selectedRecipients.has(r.id),
      );

      const result = await sendBulkEmail({
        recipients: targetRecipients,
        subject: subject.trim(),
        htmlContent,
      });

      setSendResult(result);

      const errorCount = result?.errors?.length ?? 0;
      if (errorCount > 0) {
        const sent = targetRecipients.length - errorCount;
        setSuccessMessage(
          `${sent} email${sent > 1 ? "s" : ""} envoyé${sent > 1 ? "s" : ""} avec succès. ${errorCount} échec${errorCount > 1 ? "s" : ""}.`,
        );
      } else {
        setSuccessMessage(
          `${targetRecipients.length} email${targetRecipients.length > 1 ? "s" : ""} envoyé${targetRecipients.length > 1 ? "s" : ""} avec succès.`,
        );
      }

      setSendStatus("success");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue.";
      setErrorMessage(message);
      setSendStatus("error");
    }
  }, [selectedCount, subject, htmlContent, recipients, selectedRecipients]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      {/* ── Backdrop ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed top-0 left-0 w-screen h-screen z-[120]"
        style={{ background: "rgba(10,10,10,0.55)" }}
      />

      {/* ── Modal ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="fixed top-0 left-0 w-screen h-screen z-[130] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Composeur d'email"
      >
        <div className="ecm-modal">
          {/* ── Header ── */}
          <div className="ecm-header">
            <div className="ecm-header-left">
              <div className="ecm-icon-wrap" aria-hidden="true">
                <Send size={16} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="ecm-title">Envoyer un message</h2>
                <p className="ecm-subtitle" aria-live="polite">
                  {selectedCount > 0
                    ? `${selectedCount} destinataire${selectedCount > 1 ? "s" : ""} sélectionné${selectedCount > 1 ? "s" : ""}`
                    : "Aucun destinataire sélectionné"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={sendStatus === "sending"}
              className="ecm-close"
              aria-label="Fermer la fenêtre"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="ecm-body">
            {/* Subject */}
            <div className="ecm-field">
              <label htmlFor="ecm-subject" className="ecm-label">
                Objet{" "}
                <span className="ecm-req" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="ecm-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex : Mise à jour importante…"
                disabled={sendStatus === "sending"}
                className="ecm-input"
                autoComplete="off"
              />
            </div>

            {/* Rich text editor */}
            <div className="ecm-field">
              <label className="ecm-label">
                Corps du message{" "}
                <span className="ecm-req" aria-hidden="true">
                  *
                </span>
              </label>
              <div className="ecm-editor-wrap">
                <ReactQuill
                  value={htmlContent}
                  onChange={setHtmlContent}
                  modules={quillModules}
                  formats={quillFormats}
                  theme="snow"
                  placeholder="Écrivez votre message ici…"
                  readOnly={sendStatus === "sending"}
                  className="ecm-quill"
                />
              </div>
              <p className="ecm-hint">
                Mise en forme, liens et couleurs disponibles dans la barre
                d&apos;outils.
              </p>
            </div>

            {/* Recipients */}
            <div className="ecm-field">
              <div className="ecm-recipients-header">
                <label className="ecm-label">
                  Destinataires{" "}
                  <span className="ecm-count" aria-live="polite">
                    ({selectedCount}/{recipients.length})
                  </span>{" "}
                  <span className="ecm-req" aria-hidden="true">
                    *
                  </span>
                </label>
                <button
                  onClick={toggleSelectAll}
                  disabled={sendStatus === "sending"}
                  className="ecm-btn-ghost"
                >
                  {isAllSelected ? "Tout désélectionner" : "Tout sélectionner"}
                </button>
              </div>

              <div
                className="ecm-recipient-list"
                role="group"
                aria-label="Liste des destinataires"
              >
                {recipients.length === 0 ? (
                  <p className="ecm-empty">Aucun utilisateur disponible</p>
                ) : (
                  recipients.map((recipient) => (
                    <label key={recipient.id} className="ecm-recipient-row">
                      <input
                        type="checkbox"
                        checked={selectedRecipients.has(recipient.id)}
                        onChange={() => toggleRecipient(recipient.id)}
                        disabled={sendStatus === "sending"}
                        className="ecm-checkbox"
                        aria-label={`Sélectionner ${recipient.name}`}
                      />
                      <div className="ecm-recipient-info">
                        <span className="ecm-recipient-name">
                          {recipient.name}
                        </span>
                        <span className="ecm-recipient-email">
                          {recipient.email}
                        </span>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* ── Status banners ── */}
            {sendStatus === "error" && errorMessage && (
              <motion.div
                role="alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="ecm-banner ecm-banner--error"
              >
                <AlertCircle size={17} strokeWidth={2} aria-hidden="true" />
                <p>{errorMessage}</p>
              </motion.div>
            )}

            {sendStatus === "success" && successMessage && (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="ecm-banner ecm-banner--success"
              >
                <CheckCircle size={17} strokeWidth={2} aria-hidden="true" />
                <div>
                  <p style={{ fontWeight: 600 }}>{successMessage}</p>
                  {(sendResult?.errors?.length ?? 0) > 0 && (
                    <details style={{ marginTop: 4 }}>
                      <summary className="ecm-detail-toggle">
                        Voir les erreurs ({sendResult?.errors?.length ?? 0})
                      </summary>
                      <ul className="ecm-error-list">
                        {sendResult?.errors?.map((error, idx) => (
                          <li key={idx}>
                            • {error.email} : {error.error}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </motion.div>
            )}

            {sendStatus === "sending" && (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="ecm-banner ecm-banner--info"
              >
                <span className="ecm-spinner" aria-hidden="true" />
                <p>Envoi des emails en cours…</p>
              </motion.div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="ecm-footer">
            <button
              onClick={onClose}
              disabled={sendStatus === "sending"}
              className="ecm-btn-secondary"
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              disabled={
                sendStatus === "sending" ||
                selectedCount === 0 ||
                !subject.trim()
              }
              className="ecm-btn-primary"
              aria-busy={sendStatus === "sending"}
            >
              {sendStatus === "sending" ? (
                <>
                  <span
                    className="ecm-spinner ecm-spinner--white"
                    aria-hidden="true"
                  />
                  Envoi…
                </>
              ) : (
                <>
                  <Send size={15} strokeWidth={2.5} aria-hidden="true" />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Styles ── */}
      <style jsx global>{`
        /* ─── Variables ─── */
        .ecm-modal {
          --white: #ffffff;
          --snow: #f8f8f6;
          --offwhite: #f2f1ee;
          --border: #e4e3e0;
          --border-dark: #c8c7c3;
          --text-main: #111110;
          --text-sub: #5a5a56;
          --text-muted: #9b9a96;
          --accent: #059669;
          --accent-dark: #047857;
          --accent-bg: #ecfdf5;
          --accent-border: #a7f3d0;
          --error: #dc2626;
          --error-bg: #fef2f2;
          --error-border: #fca5a5;
          --info: #1d4ed8;
          --info-bg: #eff6ff;
          --info-border: #bfdbfe;
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 18px;
        }

        /* ─── Shell ─── */
        .ecm-modal {
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.04),
            0 12px 40px rgba(0, 0, 0, 0.12);
          max-width: 680px;
          width: 100%;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ─── Header ─── */
        .ecm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 28px;
          background: var(--snow);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .ecm-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .ecm-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: var(--text-main);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ecm-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .ecm-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 2px 0 0;
        }
        .ecm-close {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background: var(--white);
          color: var(--text-sub);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            background 0.15s,
            border-color 0.15s,
            color 0.15s;
          flex-shrink: 0;
        }
        .ecm-close:hover:not(:disabled) {
          background: var(--offwhite);
          color: var(--text-main);
          border-color: var(--border-dark);
        }
        .ecm-close:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* ─── Body ─── */
        .ecm-body {
          flex: 1;
          overflow-y: auto;
          padding: 26px 28px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          scroll-behavior: smooth;
        }
        .ecm-body::-webkit-scrollbar {
          width: 5px;
        }
        .ecm-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .ecm-body::-webkit-scrollbar-thumb {
          background: var(--border-dark);
          border-radius: 99px;
        }

        /* ─── Field ─── */
        .ecm-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .ecm-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-main);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .ecm-req {
          color: var(--error);
          margin-left: 2px;
        }
        .ecm-hint {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin: 0;
        }

        /* ─── Text input ─── */
        .ecm-input {
          width: 100%;
          padding: 11px 15px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border);
          background: var(--white);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-main);
          outline: none;
          transition:
            border-color 0.15s,
            box-shadow 0.15s;
          box-sizing: border-box;
        }
        .ecm-input::placeholder {
          color: var(--text-muted);
          font-weight: 400;
        }
        .ecm-input:focus {
          border-color: var(--text-main);
          box-shadow: 0 0 0 3px rgba(17, 17, 16, 0.08);
        }
        .ecm-input:disabled {
          background: var(--snow);
          color: var(--text-muted);
          cursor: not-allowed;
        }

        /* ─── Quill wrapper ─── */
        .ecm-editor-wrap {
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          transition:
            border-color 0.15s,
            box-shadow 0.15s;
        }
        .ecm-editor-wrap:focus-within {
          border-color: var(--text-main);
          box-shadow: 0 0 0 3px rgba(17, 17, 16, 0.08);
        }

        /* Quill toolbar */
        .ecm-quill .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid var(--border) !important;
          background: var(--snow);
          padding: 8px 12px;
        }
        .ecm-quill .ql-container {
          border: none !important;
          font-size: 0.92rem;
          color: var(--text-main);
        }
        .ecm-quill .ql-editor {
          min-height: 210px;
          padding: 14px 16px;
          color: var(--text-main);
          line-height: 1.65;
        }
        .ecm-quill .ql-editor.ql-blank::before {
          color: var(--text-muted);
          font-style: normal;
        }
        /* toolbar icons */
        .ecm-quill .ql-toolbar button {
          border-radius: 5px;
          transition: background 0.12s;
          padding: 3px 5px;
        }
        .ecm-quill .ql-toolbar button:hover,
        .ecm-quill .ql-toolbar button.ql-active {
          background: var(--offwhite);
          color: var(--text-main) !important;
        }
        .ecm-quill .ql-toolbar button:hover .ql-stroke,
        .ecm-quill .ql-toolbar button.ql-active .ql-stroke {
          stroke: var(--text-main) !important;
        }
        .ecm-quill .ql-toolbar button:hover .ql-fill,
        .ecm-quill .ql-toolbar button.ql-active .ql-fill {
          fill: var(--text-main) !important;
        }

        /* ─── Recipients ─── */
        .ecm-recipients-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ecm-count {
          font-weight: 500;
          color: var(--text-muted);
          text-transform: none;
          letter-spacing: 0;
        }
        .ecm-recipient-list {
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          max-height: 188px;
          overflow-y: auto;
          background: var(--white);
          scroll-behavior: smooth;
        }
        .ecm-recipient-list::-webkit-scrollbar {
          width: 4px;
        }
        .ecm-recipient-list::-webkit-scrollbar-thumb {
          background: var(--border-dark);
          border-radius: 99px;
        }

        .ecm-empty {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
          padding: 22px 0;
          margin: 0;
        }
        .ecm-recipient-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          cursor: pointer;
          border-bottom: 1px solid var(--border);
          transition: background 0.12s;
        }
        .ecm-recipient-row:last-child {
          border-bottom: none;
        }
        .ecm-recipient-row:hover {
          background: var(--snow);
        }

        .ecm-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--text-main);
          cursor: pointer;
          flex-shrink: 0;
        }
        .ecm-checkbox:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ecm-recipient-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          gap: 1px;
        }
        .ecm-recipient-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ecm-recipient-email {
          font-size: 0.73rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ─── Banners ─── */
        .ecm-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          border: 1.5px solid;
          font-size: 0.85rem;
        }
        .ecm-banner p {
          margin: 0;
          line-height: 1.5;
        }
        .ecm-banner--error {
          background: var(--error-bg);
          border-color: var(--error-border);
          color: var(--error);
        }
        .ecm-banner--success {
          background: var(--accent-bg);
          border-color: var(--accent-border);
          color: var(--accent-dark);
        }
        .ecm-banner--info {
          background: var(--info-bg);
          border-color: var(--info-border);
          color: var(--info);
        }

        .ecm-detail-toggle {
          font-size: 0.75rem;
          cursor: pointer;
          color: var(--accent);
          margin-top: 4px;
        }
        .ecm-error-list {
          margin: 4px 0 0;
          padding-left: 14px;
          font-size: 0.74rem;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        /* ─── Spinner ─── */
        @keyframes ecm-spin {
          to {
            transform: rotate(360deg);
          }
        }
        .ecm-spinner {
          display: inline-block;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid rgba(29, 78, 216, 0.3);
          border-top-color: var(--info);
          animation: ecm-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        .ecm-spinner--white {
          border-color: rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
        }

        /* ─── Buttons ─── */
        .ecm-btn-ghost {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-sub);
          background: none;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 5px 12px;
          cursor: pointer;
          transition:
            background 0.12s,
            color 0.12s,
            border-color 0.12s;
          white-space: nowrap;
        }
        .ecm-btn-ghost:hover:not(:disabled) {
          background: var(--offwhite);
          color: var(--text-main);
          border-color: var(--border-dark);
        }
        .ecm-btn-ghost:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* ─── Footer ─── */
        .ecm-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
          padding: 16px 28px;
          background: var(--snow);
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }

        .ecm-btn-secondary {
          padding: 9px 20px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border);
          background: var(--white);
          color: var(--text-sub);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition:
            background 0.12s,
            color 0.12s,
            border-color 0.12s;
        }
        .ecm-btn-secondary:hover:not(:disabled) {
          background: var(--offwhite);
          color: var(--text-main);
          border-color: var(--border-dark);
        }
        .ecm-btn-secondary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ecm-btn-primary {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 22px;
          border-radius: var(--radius-sm);
          border: 1.5px solid transparent;
          background: var(--text-main);
          color: var(--white);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 0.15s,
            box-shadow 0.15s,
            transform 0.1s;
        }
        .ecm-btn-primary:hover:not(:disabled) {
          background: #1e1e1c;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
        }
        .ecm-btn-primary:active:not(:disabled) {
          transform: translateY(1px);
        }
        .ecm-btn-primary:disabled {
          background: var(--border);
          color: var(--text-muted);
          cursor: not-allowed;
          box-shadow: none;
        }
        .ecm-btn-primary:focus-visible,
        .ecm-btn-secondary:focus-visible,
        .ecm-btn-ghost:focus-visible,
        .ecm-close:focus-visible,
        .ecm-input:focus-visible {
          outline: 2px solid var(--text-main);
          outline-offset: 2px;
        }
      `}</style>
    </>,
    document.body,
  );
}

export default React.memo(EmailComposerModalComponent);
