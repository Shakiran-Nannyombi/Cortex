import api from './client';
import type {
  AuthResponse,
  Document,
  Workspace,
  Folder,
  Tag,
  PaginatedResponse,
  DashboardData,
} from '../types';

// Auth
export const authApi = {
  register: (data: { email: string; username: string; password: string; full_name?: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  me: () => api.get<{ user: AuthResponse['user'] }>('/auth/me'),
  updateProfile: (data: { full_name?: string; username?: string }) =>
    api.put<{ user: AuthResponse['user'] }>('/auth/me', data),
};

// Documents
export const documentsApi = {
  upload: (formData: FormData) =>
    api.post<{ document: Document }>('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  list: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Document>>('/documents', { params }),
  get: (id: string) => api.get<{ document: Document }>(`/documents/${id}`),
  update: (id: string, data: Partial<Document> & { tag_ids?: string[] }) =>
    api.put<{ document: Document }>(`/documents/${id}`, data),
  delete: (id: string) => api.delete(`/documents/${id}`),
  reprocess: (id: string) =>
    api.post<{ document: Document }>(`/documents/${id}/reprocess`),
};

// Search
export const searchApi = {
  search: (params: { q: string; page?: number; per_page?: number; workspace_id?: string }) =>
    api.get<PaginatedResponse<Document> & { query: string }>('/search', { params }),
};

// Workspaces
export const workspacesApi = {
  create: (data: { name: string; description?: string }) =>
    api.post<{ workspace: Workspace }>('/workspaces', data),
  list: () => api.get<{ workspaces: Workspace[] }>('/workspaces'),
  get: (id: string) => api.get<{ workspace: Workspace }>(`/workspaces/${id}`),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.put<{ workspace: Workspace }>(`/workspaces/${id}`, data),
  delete: (id: string) => api.delete(`/workspaces/${id}`),
};

// Folders
export const foldersApi = {
  create: (data: { name: string; workspace_id: string; parent_id?: string }) =>
    api.post<{ folder: Folder }>('/folders', data),
  list: (params: { workspace_id: string; parent_id?: string }) =>
    api.get<{ folders: Folder[] }>('/folders', { params }),
  update: (id: string, data: { name: string }) =>
    api.put<{ folder: Folder }>(`/folders/${id}`, data),
  delete: (id: string) => api.delete(`/folders/${id}`),
};

// Tags
export const tagsApi = {
  create: (data: { name: string; color?: string }) =>
    api.post<{ tag: Tag }>('/tags', data),
  list: () => api.get<{ tags: Tag[] }>('/tags'),
  update: (id: string, data: { name?: string; color?: string }) =>
    api.put<{ tag: Tag }>(`/tags/${id}`, data),
  delete: (id: string) => api.delete(`/tags/${id}`),
};

// Analytics
export const analyticsApi = {
  dashboard: () => api.get<DashboardData>('/analytics/dashboard'),
};
