// RichEditor.tsx
"use client";

import React, { useEffect, useRef, useCallback } from "react";
import DOMPurify from "dompurify";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  LucideIcon,
} from "lucide-react";

interface RichEditorProps {
  content: string;
  setContent: (content: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  isActive?: boolean;
}

// Composant ToolbarButton déplacé hors du render
const ToolbarButton = ({
  onClick,
  icon: Icon,
  title,
  isActive,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded transition-colors ${
      isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    <Icon size={18} />
  </button>
);

/**
 * Éditeur texte riche (WYSIWYG)
 */
export default function RichEditor({ content, setContent }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Synchroniser le contenu externe vers l'éditeur avec HTML sanitization
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      // Ne mettre à jour que si différent pour éviter le curseur qui saute
      const currentHtml = editorRef.current.innerHTML;
      const newContent = content || "";
      const sanitizedContent = DOMPurify.sanitize(newContent);
      if (currentHtml !== sanitizedContent) {
        editorRef.current.innerHTML = sanitizedContent;
      }
    }
  }, [content]);

  const execCommand = useCallback(
    (command: string, value: string | undefined = undefined) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
      if (editorRef.current) {
        isUpdatingRef.current = true;
        setContent(editorRef.current.innerHTML);
        // Reset le flag après le prochain render
        requestAnimationFrame(() => {
          isUpdatingRef.current = false;
        });
      }
    },
    [setContent],
  );

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      setContent(editorRef.current.innerHTML);
      requestAnimationFrame(() => {
        isUpdatingRef.current = false;
      });
    }
  }, [setContent]);

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50 border-gray-200 flex-wrap">
        <ToolbarButton
          onClick={() => execCommand("bold")}
          icon={Bold}
          title="Gras"
        />
        <ToolbarButton
          onClick={() => execCommand("italic")}
          icon={Italic}
          title="Italique"
        />
        <ToolbarButton
          onClick={() => execCommand("underline")}
          icon={Underline}
          title="Souligné"
        />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton
          onClick={() => execCommand("formatBlock", "H1")}
          icon={Heading1}
          title="Titre 1"
        />
        <ToolbarButton
          onClick={() => execCommand("formatBlock", "H2")}
          icon={Heading2}
          title="Titre 2"
        />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton
          onClick={() => execCommand("insertUnorderedList")}
          icon={List}
          title="Liste à puces"
        />
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[200px] outline-none prose max-w-none"
        style={{ whiteSpace: "pre-wrap" }}
        role="textbox"
        aria-multiline="true"
      />
    </div>
  );
}
