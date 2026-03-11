interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    circle?: boolean;
}

export default function Skeleton({
    width = '100%',
    height = '1rem',
    className = '',
    circle = false,
}: SkeletonProps) {
    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const heightStyle = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${circle ? 'rounded-full' : 'rounded'
                } ${className}`}
            style={{
                width: widthStyle,
                height: heightStyle,
            }}
        />
    );
}
