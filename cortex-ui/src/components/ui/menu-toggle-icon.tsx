import { cn } from '@/lib/utils';

interface MenuToggleIconProps {
  open: boolean;
  className?: string;
  duration?: number;
}

export function MenuToggleIcon({ open, className, duration = 300 }: MenuToggleIconProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <span
        className={cn(
          "absolute h-0.5 w-full bg-current transition-all",
          open ? "rotate-45" : "-translate-y-1.5"
        )}
        style={{ transitionDuration: `${duration}ms` }}
      />
      <span
        className={cn(
          "absolute h-0.5 w-full bg-current transition-all",
          open ? "opacity-0" : "opacity-100"
        )}
        style={{ transitionDuration: `${duration}ms` }}
      />
      <span
        className={cn(
          "absolute h-0.5 w-full bg-current transition-all",
          open ? "-rotate-45" : "translate-y-1.5"
        )}
        style={{ transitionDuration: `${duration}ms` }}
      />
    </div>
  );
}
