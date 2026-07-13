// schemas.ts
import { TableSchemaMap } from "./types";

export const TABLE_SCHEMAS: TableSchemaMap = {
  profiles: [
    { key: "name", label: "Nom", type: "text" },
    { key: "surname", label: "Prénom", type: "text" },
    { key: "email", label: "Email", type: "email" },
    {
      key: "role",
      label: "Rôle",
      type: "select",
      options: ["member", "admin"],
    },
    { key: "photo", label: "Photo de profil", type: "single_image" },
  ],
  bureau: [
    { key: "name", label: "Nom", type: "text" },
    { key: "surname", label: "Prénom", type: "text" },
    { key: "role", label: "Poste/Rôle", type: "text" },
    { key: "order", label: "Ordre d'affichage", type: "number" },
    { key: "biography", label: "Biographie", type: "textarea" },
    { key: "photo", label: "Photo", type: "single_image" },
  ],
  events: [
    { key: "title", label: "Titre de l'événement", type: "text" },
    { key: "date", label: "Date et Heure", type: "datetime-local" },
    { key: "cover_photo", label: "Photo Principale", type: "single_image" },
    { key: "other_photos", label: "Galerie Photos", type: "multiple_images" },
    { key: "content", label: "Description détaillée", type: "rich_text" },
  ],
  reports: [
    { key: "title", label: "Titre du rapport", type: "text" },
    { key: "date", label: "Date de publication", type: "date" },
    { key: "document_pdf_link", label: "Document PDF (URL)", type: "file_url" },
    { key: "content", label: "Contenu / Résumé", type: "rich_text" },
  ],
  albums: [
    { key: "event_id", label: "ID Événement lié (UUID)", type: "text" },
    { key: "event_title", label: "Titre de l'événement lié", type: "text" },
    { key: "event_date", label: "Date de l'événement", type: "date" },
    { key: "photos", label: "Photos de l'album", type: "multiple_images" },
  ],
};
