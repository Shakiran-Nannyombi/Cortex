import type { User } from './index';

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
}
