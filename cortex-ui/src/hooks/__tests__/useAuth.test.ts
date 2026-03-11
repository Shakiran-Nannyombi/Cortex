import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { renderWithProviders } from '../../__tests__/utils';

describe('useAuth Hook', () => {
    it('returns auth context value', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: ({ children }) => renderWithProviders(children as any),
        });

        expect(result.current).toBeDefined();
        expect(result.current.user).toBeDefined();
        expect(result.current.isLoading).toBeDefined();
        expect(result.current.login).toBeDefined();
        expect(result.current.register).toBeDefined();
        expect(result.current.logout).toBeDefined();
    });

    it('throws error when used outside AuthProvider', () => {
        expect(() => {
            renderHook(() => useAuth());
        }).toThrow('useAuth must be used within an AuthProvider');
    });

    it('provides login function', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: ({ children }) => renderWithProviders(children as any),
        });

        expect(result.current.login).toBeInstanceOf(Function);
    });

    it('provides register function', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: ({ children }) => renderWithProviders(children as any),
        });

        expect(result.current.register).toBeInstanceOf(Function);
    });

    it('provides logout function', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: ({ children }) => renderWithProviders(children as any),
        });

        expect(result.current.logout).toBeInstanceOf(Function);
    });
});
