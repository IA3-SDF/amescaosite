// types.ts
// Types et interfaces pour l'admin

export type TableName = "profiles" | "bureau" | "events" | "reports" | "albums";
export type AdminTableName = TableName | "sendMessage";

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  photo?: string;
  role: "member" | "admin";
}

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "date"
  | "datetime-local"
  | "file_url"
  | "select"
  | "textarea"
  | "rich_text"
  | "single_image"
  | "multiple_images";

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
}

export type TableSchemaMap = Record<TableName, FieldSchema[]>;

export interface NavItem {
  id: AdminTableName;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface DatabaseItem {
  id: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}
