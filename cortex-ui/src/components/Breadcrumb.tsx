import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center gap-2 text-sm">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    {index > 0 && (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    {item.href || item.onClick ? (
                        <a
                            href={item.href || '#'}
                            onClick={(e) => {
                                if (item.onClick) {
                                    e.preventDefault();
                                    item.onClick();
                                }
                            }}
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            {item.label}
                        </a>
                    ) : (
                        <span className="text-gray-600 dark:text-gray-400">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
