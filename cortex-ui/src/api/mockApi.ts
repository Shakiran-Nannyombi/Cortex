/**
 * Mock API for development/fallback when backend is unavailable
 * Used when Render is starting up or during local development
 */

export const mockApi = {
    // Mock demo account
    demoLogin: async () => {
        return {
            access_token: 'mock-token-' + Date.now(),
            refresh_token: 'mock-refresh-' + Date.now(),
            user: {
                id: 1,
                email: 'demo@cortex.app',
                name: 'Demo User',
            },
        };
    },

    // Mock workspaces
    getWorkspaces: async () => {
        return {
            workspaces: [
                {
                    id: 1,
                    name: 'Reports',
                    description: 'Financial and business reports',
                    created_at: new Date().toISOString(),
                },
                {
                    id: 2,
                    name: 'Contracts',
                    description: 'Legal contracts and agreements',
                    created_at: new Date().toISOString(),
                },
            ],
        };
    },

    // Mock folders
    getFolders: async (workspaceId: number) => {
        return {
            folders: [
                {
                    id: 1,
                    name: 'Q1 Reports',
                    workspace_id: workspaceId,
                    created_at: new Date().toISOString(),
                },
                {
                    id: 2,
                    name: 'Q2 Reports',
                    workspace_id: workspaceId,
                    created_at: new Date().toISOString(),
                },
            ],
        };
    },

    // Mock documents
    getDocuments: async () => {
        return {
            documents: [
                {
                    id: 1,
                    name: 'Financial Report Q1',
                    status: 'completed',
                    created_at: new Date().toISOString(),
                },
                {
                    id: 2,
                    name: 'Annual Report 2025',
                    status: 'completed',
                    created_at: new Date().toISOString(),
                },
            ],
        };
    },

    // Mock tags
    getTags: async () => {
        return {
            tags: [
                { id: 1, name: 'Important', color: '#FF6B6B' },
                { id: 2, name: 'Review', color: '#4ECDC4' },
                { id: 3, name: 'Archive', color: '#95E1D3' },
            ],
        };
    },

    // Mock API keys
    getApiKeys: async () => {
        return {
            api_keys: [
                {
                    id: 1,
                    name: 'Production',
                    preview: 'sk_live_****',
                    created_at: new Date().toISOString(),
                },
                {
                    id: 2,
                    name: 'Development',
                    preview: 'sk_test_****',
                    created_at: new Date().toISOString(),
                },
            ],
        };
    },

    // Mock chat
    sendMessage: async (message: string) => {
        return {
            message: `Demo response: You asked "${message}". In production, this would be powered by OpenAI. The backend is currently starting up on Render.`,
        };
    },
};
