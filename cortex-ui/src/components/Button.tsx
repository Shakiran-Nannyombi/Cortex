import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: ReactNode;
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    children,
    onClick,
    type = 'button',
    className = '',
}: ButtonProps) {
    const baseStyles =
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary:
            'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
        secondary:
            'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
        danger:
            'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        ghost:
            'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-100 dark:hover:bg-gray-800',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm gap-2',
        md: 'px-4 py-2 text-base gap-2',
        lg: 'px-6 py-3 text-lg gap-2',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
            {children}
        </button>
    );
}
