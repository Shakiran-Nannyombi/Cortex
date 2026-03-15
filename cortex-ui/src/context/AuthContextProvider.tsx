import { useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../api/endpoints';
import type { User } from '../types';
import { AuthContext } from './AuthContext';

const DEMO_USER = {
    id: '1',
    email: 'demo@cortex.app',
    full_name: 'Demo User',
    username: 'demo',
    is_active: true,
    is_admin: false,
    created_at: new Date().toISOString(),
} as User;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Check for demo mode first
            if (token === 'demo-mock-token') {
                setUser(DEMO_USER);
                setIsLoading(false);
                return;
            }

            authApi.me()
                .then((res) => setUser(res.data.user))
                .catch(() => {
                    // If API fails, clear auth
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('demo_user');
                    localStorage.removeItem('demo_mode');
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await authApi.login({ email, password });
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        setUser(res.data.user);
    };

    const demoLogin = async () => {
        // Try backend first with short timeout, fall back to offline immediately
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://cortex-nboq.onrender.com';
            const response = await fetch(`${apiUrl}/api/auth/demo-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
            });
            clearTimeout(timeout);
            if (!response.ok) throw new Error('failed');
            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            setUser(data.user);
        } catch {
            clearTimeout(timeout);
            // Offline fallback - instant
            localStorage.setItem('access_token', 'demo-mock-token');
            localStorage.setItem('refresh_token', 'demo-mock-refresh');
            setUser(DEMO_USER);
        }
    };
    const register = async (email: string, username: string, password: string, fullName: string) => {
        const res = await authApi.register({ email, username, password, full_name: fullName });
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('demo_mode');
        localStorage.removeItem('demo_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, demoLogin }}>
            {children}
        </AuthContext.Provider>
    );
}
