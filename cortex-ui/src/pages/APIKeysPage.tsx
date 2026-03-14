import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Key, Plus, Copy, Trash2, X, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../hooks/useTheme';

// Mock API for API keys - replace with actual endpoints
interface APIKey {
    id: string;
    name: string;
    keyPreview: string;
    createdAt: string;
    isRevoked: boolean;
}

interface CreateAPIKeyResponse {
    apiKey: APIKey;
    keyValue: string;
}

const apiKeysApi = {
    list: () => Promise.resolve({ data: { apiKeys: [] as APIKey[] } }),
    create: (data: { name: string }) => Promise.resolve({ data: { apiKey: { id: '1', name: data.name, keyPreview: '****', createdAt: new Date().toISOString(), isRevoked: false }, keyValue: 'sk_test_' + Math.random().toString(36).substr(2, 9) } as CreateAPIKeyResponse }),
    revoke: (id: string) => Promise.resolve({ data: { revoked: id } }),
};

export default function APIKeysPage() {
    const { isDark } = useTheme();
    const queryClient = useQueryClient();
    const [showCreate, setShowCreate] = useState(false);
    const [showKey, setShowKey] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [createdKey, setCreatedKey] = useState<CreateAPIKeyResponse | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['apiKeys'],
        queryFn: () => apiKeysApi.list().then((r) => r.data),
    });

    const createMutation = useMutation({
        mutationFn: () => apiKeysApi.create({ name }),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
            setCreatedKey(result.data);
            setShowCreate(false);
            setName('');
            toast.success('API key created!');
        },
        onError: () => toast.error('Failed to create API key'),
    });

    const revokeMutation = useMutation({
        mutationFn: (id: string) => apiKeysApi.revoke(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
            toast.success('API key revoked');
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>API Keys</h1>
                <button
                    onClick={() => {
                        setShowCreate(true);
                        setName('');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                    <Plus className="w-4 h-4" /> New API Key
                </button>
            </div>

            {/* Create Form */}
            {showCreate && (
                <div className={`rounded-xl border p-5 transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create API Key</h3>
                        <button
                            onClick={() => setShowCreate(false)}
                            className={`p-1 transition-colors ${isDark ? 'text-blue-400/60 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            createMutation.mutate();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-blue-100/60' : 'text-gray-700'}`}>Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                                    isDark ? 'bg-blue-900/40 border-blue-800 text-white placeholder-blue-400/30' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                                placeholder="e.g., Production API Key"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
                        >
                            {createMutation.isPending ? 'Creating...' : 'Create'}
                        </button>
                    </form>
                </div>
            )}

            {/* Created Key Display */}
            {createdKey && (
                <div className={`rounded-xl border p-5 transition-colors duration-300 ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-900'}`}>API Key Created</h3>
                            <p className={`text-sm mt-1 ${isDark ? 'text-green-400/60' : 'text-green-700'}`}>
                                Save this key somewhere safe. You won't be able to see it again.
                            </p>
                        </div>
                        <button
                            onClick={() => setCreatedKey(null)}
                            className={`p-1 ${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-400 hover:text-green-600'}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className={`rounded-lg p-3 mb-3 flex items-center justify-between border transition-colors ${isDark ? 'bg-blue-950/40 border-green-800/50' : 'bg-white border-green-100'}`}>
                        <code className={`text-sm font-mono break-all ${isDark ? 'text-green-400' : 'text-gray-900'}`}>
                            {showKey === createdKey.keyValue
                                ? createdKey.keyValue
                                : '•'.repeat(createdKey.keyValue.length)}
                        </code>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowKey(showKey === createdKey.keyValue ? null : createdKey.keyValue)}
                                className={`p-1 transition-colors ${isDark ? 'text-green-400/60 hover:text-green-400' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {showKey === createdKey.keyValue ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(createdKey.keyValue);
                                    toast.success('Copied to clipboard');
                                }}
                                className={`p-1 transition-colors ${isDark ? 'text-green-400/60 hover:text-green-400' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* API Keys List */}
            <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${isDark ? 'bg-blue-900/40 border-blue-800' : 'bg-white border-gray-200'}`}>
                {(data?.apiKeys ?? []).length === 0 ? (
                    <div className={`p-8 text-center ${isDark ? 'text-blue-100/40' : 'text-gray-400'}`}>
                        <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No API keys yet. Create one to get started.</p>
                    </div>
                ) : (
                    <div className={`divide-y ${isDark ? 'divide-blue-800' : 'divide-gray-100'}`}>
                        {data?.apiKeys.map((key: APIKey) => (
                            <div key={key.id} className={`p-4 flex items-center justify-between ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                <div>
                                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{key.name}</p>
                                    <p className={`text-sm mt-0.5 ${isDark ? 'text-blue-100/60' : 'text-gray-500'}`}>
                                        {key.keyPreview} • Created {new Date(key.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {key.isRevoked && (
                                        <span className={`px-2 py-1 text-xs rounded border ${isDark ? 'bg-red-900/20 text-red-400 border-red-900/50' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                            Revoked
                                        </span>
                                    )}
                                    {!key.isRevoked && (
                                        <button
                                            onClick={() => revokeMutation.mutate(key.id)}
                                            className={`p-1.5 transition-colors ${isDark ? 'text-blue-400/40 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
