export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface Document {
  id: string;
  title: string;
  filename: string;
  file_size: number;
  mime_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  page_count: number;
  content_preview: string;
  content_text?: string;
  error_message: string;
  user_id: string;
  workspace_id: string | null;
  folder_id: string | null;
  tags: Tag[];
  created_at: string;
  updated_at: string;
  processed_at: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  user_id: string;
  document_count: number;
  folder_count: number;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  name: string;
  workspace_id: string;
  parent_id: string | null;
  document_count: number;
  children_count: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  documents: T[];
  total: number;
  page: number;
  per_page: number;
  pages?: number;
}

export interface DashboardData {
  total_documents: number;
  total_workspaces: number;
  total_tags: number;
  total_storage_bytes: number;
  status_breakdown: Record<string, number>;
  type_breakdown: Record<string, number>;
  recent_documents: Document[];
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  message?: string;
}
