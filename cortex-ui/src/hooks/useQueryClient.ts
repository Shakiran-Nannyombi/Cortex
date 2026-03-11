import { useQueryClient as useReactQueryClient } from '@tanstack/react-query';

export function useQueryClient() {
    return useReactQueryClient();
}

// Query key factory
export const queryKeys = {
    auth: ['auth'] as const,
    user: (id: string) => ['user', id] as const,

    documents: {
        all: ['documents'] as const,
        lists: () => [...queryKeys.documents.all, 'list'] as const,
        list: (filters: Record<string, string | number | boolean>) =>
            [...queryKeys.documents.lists(), filters] as const,
        details: () => [...queryKeys.documents.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.documents.details(), id] as const,
    },

    workspaces: {
        all: ['workspaces'] as const,
        lists: () => [...queryKeys.workspaces.all, 'list'] as const,
        detail: (id: string) => [...queryKeys.workspaces.all, id] as const,
        folders: (id: string) =>
            [...queryKeys.workspaces.detail(id), 'folders'] as const,
    },

    tags: {
        all: ['tags'] as const,
        lists: () => [...queryKeys.tags.all, 'list'] as const,
        detail: (id: string) => [...queryKeys.tags.all, id] as const,
    },

    apiKeys: {
        all: ['apiKeys'] as const,
        lists: () => [...queryKeys.apiKeys.all, 'list'] as const,
    },

    search: (query: string, filters: Record<string, string | number | boolean>) =>
        ['search', query, filters] as const,

    dashboard: {
        stats: ['dashboard', 'stats'] as const,
    },
};
