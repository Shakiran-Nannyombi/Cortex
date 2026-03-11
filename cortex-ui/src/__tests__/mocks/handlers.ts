import { http, HttpResponse } from 'msw';
import { mockUsers, mockDocuments, mockWorkspaces, mockTags, mockApiKeys } from '../fixtures';

const API_URL = 'http://localhost:5000/api';

export const handlers = [
    // Auth endpoints
    http.post(`${API_URL}/auth/login`, async ({ request }) => {
        const body = await request.json() as any;
        if (body.email === 'test@example.com' && body.password === 'password123') {
            return HttpResponse.json({
                user: mockUsers.validUser,
                access_token: 'mock_access_token',
                refresh_token: 'mock_refresh_token',
            });
        }
        return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }),

    http.post(`${API_URL}/auth/register`, async ({ request }) => {
        const body = await request.json() as any;
        if (body.email === 'existing@example.com') {
            return HttpResponse.json({ error: 'Email already exists' }, { status: 409 });
        }
        return HttpResponse.json({
            user: { ...mockUsers.validUser, email: body.email, username: body.username },
            access_token: 'mock_access_token',
            refresh_token: 'mock_refresh_token',
        });
    }),

    http.post(`${API_URL}/auth/refresh`, () => {
        return HttpResponse.json({
            access_token: 'new_mock_access_token',
        });
    }),

    http.get(`${API_URL}/auth/me`, () => {
        return HttpResponse.json({
            user: mockUsers.validUser,
        });
    }),

    // Document endpoints
    http.get(`${API_URL}/documents`, ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get('page') || '1';
        const perPage = url.searchParams.get('per_page') || '10';

        return HttpResponse.json({
            documents: mockDocuments.list,
            total: mockDocuments.list.length,
            page: parseInt(page),
            per_page: parseInt(perPage),
            pages: Math.ceil(mockDocuments.list.length / parseInt(perPage)),
        });
    }),

    http.post(`${API_URL}/documents`, () => {
        return HttpResponse.json(mockDocuments.created, { status: 201 });
    }),

    http.get(`${API_URL}/documents/:id`, () => {
        return HttpResponse.json(mockDocuments.detail);
    }),

    http.patch(`${API_URL}/documents/:id`, async ({ request }) => {
        const body = await request.json() as any;
        return HttpResponse.json({
            ...mockDocuments.detail,
            ...body,
        });
    }),

    http.delete(`${API_URL}/documents/:id`, () => {
        return HttpResponse.json(null, { status: 204 });
    }),

    http.post(`${API_URL}/documents/:id/reprocess`, () => {
        return HttpResponse.json({
            ...mockDocuments.detail,
            status: 'processing',
        });
    }),

    // Search endpoint
    http.get(`${API_URL}/search`, ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams.get('q') || '';

        return HttpResponse.json({
            results: mockDocuments.list.filter(doc =>
                doc.title.toLowerCase().includes(query.toLowerCase())
            ),
            total: 1,
            search_time: 45,
        });
    }),

    // Workspace endpoints
    http.get(`${API_URL}/workspaces`, () => {
        return HttpResponse.json({
            workspaces: mockWorkspaces.list,
            total: mockWorkspaces.list.length,
        });
    }),

    http.post(`${API_URL}/workspaces`, () => {
        return HttpResponse.json(mockWorkspaces.created, { status: 201 });
    }),

    http.patch(`${API_URL}/workspaces/:id`, async ({ request }) => {
        const body = await request.json() as any;
        return HttpResponse.json({
            ...mockWorkspaces.detail,
            ...body,
        });
    }),

    http.delete(`${API_URL}/workspaces/:id`, () => {
        return HttpResponse.json(null, { status: 204 });
    }),

    http.get(`${API_URL}/workspaces/:id/folders`, () => {
        return HttpResponse.json({
            folders: mockWorkspaces.folders,
        });
    }),

    // Tag endpoints
    http.get(`${API_URL}/tags`, () => {
        return HttpResponse.json({
            tags: mockTags.list,
            total: mockTags.list.length,
        });
    }),

    http.post(`${API_URL}/tags`, () => {
        return HttpResponse.json(mockTags.created, { status: 201 });
    }),

    http.patch(`${API_URL}/tags/:id`, async ({ request }) => {
        const body = await request.json() as any;
        return HttpResponse.json({
            ...mockTags.detail,
            ...body,
        });
    }),

    http.delete(`${API_URL}/tags/:id`, () => {
        return HttpResponse.json(null, { status: 204 });
    }),

    // API Key endpoints
    http.get(`${API_URL}/api-keys`, () => {
        return HttpResponse.json({
            api_keys: mockApiKeys.list,
            total: mockApiKeys.list.length,
        });
    }),

    http.post(`${API_URL}/api-keys`, () => {
        return HttpResponse.json(mockApiKeys.created, { status: 201 });
    }),

    http.post(`${API_URL}/api-keys/:id/revoke`, () => {
        return HttpResponse.json({
            ...mockApiKeys.detail,
            is_revoked: true,
        });
    }),

    // Dashboard endpoint
    http.get(`${API_URL}/dashboard/stats`, () => {
        return HttpResponse.json({
            total_documents: 42,
            total_workspaces: 3,
            total_tags: 8,
            total_storage_bytes: 1073741824,
            status_breakdown: {
                pending: 5,
                processing: 3,
                completed: 30,
                failed: 4,
            },
            type_breakdown: {
                pdf: 20,
                docx: 15,
                txt: 5,
                png: 2,
            },
            recent_documents: mockDocuments.list.slice(0, 5),
        });
    }),
];
