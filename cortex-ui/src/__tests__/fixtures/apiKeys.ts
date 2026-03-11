export const list = [
    {
        id: 'key-1',
        name: 'Development Key',
        key_preview: '...a1b2',
        created_at: '2024-01-01T00:00:00Z',
        last_used_at: '2024-01-16T10:00:00Z',
        expires_at: null,
        is_revoked: false,
    },
    {
        id: 'key-2',
        name: 'Production Key',
        key_preview: '...c3d4',
        created_at: '2024-01-05T00:00:00Z',
        last_used_at: '2024-01-17T09:00:00Z',
        expires_at: '2025-01-05T00:00:00Z',
        is_revoked: false,
    },
    {
        id: 'key-3',
        name: 'Old Key',
        key_preview: '...e5f6',
        created_at: '2023-12-01T00:00:00Z',
        last_used_at: '2024-01-10T10:00:00Z',
        expires_at: null,
        is_revoked: true,
    },
];

export const detail = list[0];

export const created = {
    id: 'key-new',
    name: 'New API Key',
    key_value: 'cortex_sk_1234567890abcdefghijklmnopqrstuvwxyz',
    key_preview: '...wxyz',
    created_at: '2024-01-17T10:00:00Z',
    last_used_at: null,
    expires_at: null,
    is_revoked: false,
};
