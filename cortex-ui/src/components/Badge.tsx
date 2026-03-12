import type { ReactNode } from 'react';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    color?: string;
    children: ReactNode;
    className?: string;
}

export default function Badge({
    variant = 'default',
    color,
    children,
    className = '',
}: BadgeProps) {
    const variantClasses = {
        default:
            'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        success:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        warning:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        error:
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };

    const customStyle = color
        ? {
            backgroundColor: `${color}20`,
            color: color,
            borderColor: color,
        }
        : undefined;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]
                } ${className}`}
            style={customStyle}
        >
            {children}
        </span>
    );
}
