// HtmlContent.tsx
"use client";

import React, { useMemo } from "react";
import DOMPurify from "dompurify";

interface HtmlContentProps {
  html: string;
  className?: string;
}

/**
 * Composant pour afficher du contenu HTML enrichi en toute sécurité
 * - Nettoie le HTML avec DOMPurify pour prévenir les attaques XSS
 * - Applique les styles Tailwind appropriés
 * - Réutilisable dans toute l'application
 */
export default function HtmlContent({
  html,
  className = "",
}: HtmlContentProps) {
  // Nettoyer et sanitizer le HTML
  const sanitizedHtml = useMemo(() => {
    if (!html) return "";
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "b",
        "i",
        "em",
        "strong",
        "u",
        "p",
        "br",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "a",
        "blockquote",
        "code",
        "pre",
        "img",
        "figure",
        "figcaption",
        "table",
        "tr",
        "td",
        "th",
        "thead",
        "tbody",
        "tfoot",
        "caption",
        "div",
        "span",
        "section",
        "article",
        "hr",
        "dl",
        "dt",
        "dd",
      ],
      ALLOWED_ATTR: [
        "href",
        "target",
        "rel",
        "src",
        "alt",
        "width",
        "height",
        "loading",
        "class",
        "id",
        "style",
      ],
      KEEP_CONTENT: true,
    });
  }, [html]);

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
