import type { User } from '../../types';

export const validUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    username: 'testuser',
    full_name: 'Test User',
    is_active: true,
    is_admin: false,
    created_at: '2024-01-01T00:00:00Z',
};

export const adminUser: User = {
    id: 'user-2',
    email: 'admin@example.com',
    username: 'admin',
    full_name: 'Admin User',
    is_active: true,
    is_admin: true,
    created_at: '2024-01-01T00:00:00Z',
};

export const inactiveUser: User = {
    id: 'user-3',
    email: 'inactive@example.com',
    username: 'inactive',
    full_name: 'Inactive User',
    is_active: false,
    is_admin: false,
    created_at: '2024-01-01T00:00:00Z',
};
