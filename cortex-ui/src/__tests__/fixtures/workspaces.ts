import type { Workspace, Folder } from '../../types';

export const list: Workspace[] = [
    {
        id: 'workspace-1',
        name: 'Personal Documents',
        description: 'My personal document collection',
        user_id: 'user-1',
        document_count: 15,
        folder_count: 3,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
    },
    {
        id: 'workspace-2',
        name: 'Work Projects',
        description: 'Work-related documents and projects',
        user_id: 'user-1',
        document_count: 27,
        folder_count: 5,
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-16T10:00:00Z',
    },
    {
        id: 'workspace-3',
        name: 'Archive',
        description: 'Archived documents',
        user_id: 'user-1',
        document_count: 0,
        folder_count: 0,
        created_at: '2024-01-10T00:00:00Z',
        updated_at: '2024-01-10T00:00:00Z',
    },
];

export const detail: Workspace = list[0];

export const created: Workspace = {
    id: 'workspace-new',
    name: 'New Workspace',
    description: 'A new workspace',
    user_id: 'user-1',
    document_count: 0,
    folder_count: 0,
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z',
};

export const folders: Folder[] = [
    {
        id: 'folder-1',
        name: 'Invoices',
        workspace_id: 'workspace-1',
        parent_id: null,
        document_count: 5,
        children_count: 0,
        created_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 'folder-2',
        name: 'Receipts',
        workspace_id: 'workspace-1',
        parent_id: null,
        document_count: 3,
        children_count: 0,
        created_at: '2024-01-02T00:00:00Z',
    },
    {
        id: 'folder-3',
        name: '2024',
        workspace_id: 'workspace-1',
        parent_id: 'folder-1',
        document_count: 2,
        children_count: 0,
        created_at: '2024-01-03T00:00:00Z',
    },
];
