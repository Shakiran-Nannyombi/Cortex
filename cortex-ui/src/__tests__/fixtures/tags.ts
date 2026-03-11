import type { Tag } from '../../types';

export const list: Tag[] = [
    {
        id: 'tag-1',
        name: 'Important',
        color: '#EF4444',
        user_id: 'user-1',
        created_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 'tag-2',
        name: 'Review',
        color: '#F59E0B',
        user_id: 'user-1',
        created_at: '2024-01-02T00:00:00Z',
    },
    {
        id: 'tag-3',
        name: 'Approved',
        color: '#10B981',
        user_id: 'user-1',
        created_at: '2024-01-03T00:00:00Z',
    },
    {
        id: 'tag-4',
        name: 'Archive',
        color: '#6B7280',
        user_id: 'user-1',
        created_at: '2024-01-04T00:00:00Z',
    },
];

export const detail: Tag = list[0];

export const created: Tag = {
    id: 'tag-new',
    name: 'New Tag',
    color: '#3B82F6',
    user_id: 'user-1',
    created_at: '2024-01-17T10:00:00Z',
};
