export interface ThemeContextType {
    theme: 'light' | 'dark';
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}
