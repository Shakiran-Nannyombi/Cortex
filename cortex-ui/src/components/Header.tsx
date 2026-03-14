'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/hooks/use-scroll';
import { useTheme } from '@/hooks/useTheme';
import { createPortal } from 'react-dom';
import { FileText, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const { isDark, toggleTheme } = useTheme();
	const scrolledWindow = useScroll(10);
	const scrolledContent = useScroll(10, 'main-content');
	const scrolled = scrolledWindow || scrolledContent;

	const links = [
		{
			label: 'Features',
			href: '#',
		},
		{
			label: 'Pricing',
			href: '#',
		},
		{
			label: 'About',
			href: '#',
		},
	];

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn('sticky top-0 z-50 w-full border-b transition-all duration-300', {
				'bg-blue-600 border-blue-500 shadow-sm': !scrolled,
				'bg-blue-600/80 border-blue-500/50 backdrop-blur-md': scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<Link to="/" className="hover:bg-white/10 rounded-md p-2 flex items-center gap-2 transition-colors">
					<FileText className="h-6 w-6 text-white" />
					<span className="text-xl font-bold text-white">Cortex</span>
				</Link>
				<div className="hidden items-center gap-2 md:flex">
					{links.map((link) => (
						<a
							key={link.label}
							className={buttonVariants({
								variant: 'ghost',
								className: 'text-white hover:text-white hover:bg-white/10',
							})}
							href={link.href}
						>
							{link.label}
						</a>
					))}
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleTheme}
						className="text-blue-100 hover:text-white hover:bg-white/10"
					>
						{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
					</Button>
					<Button
						variant="outline"
						className="border-white/20 text-white hover:bg-white/10 bg-transparent"
					>
						Sign In
					</Button>
					<Button className="bg-white text-blue-600 hover:bg-blue-50 border-none font-bold">
						Get Started
					</Button>
				</div>
				<Button
					size="icon"
					variant="ghost"
					onClick={() => setOpen(!open)}
					className="md:hidden text-white hover:bg-white/10"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>
			<MobileMenu open={open} className="flex flex-col justify-between gap-2">
				<div className="grid gap-y-2">
					{links.map((link) => (
						<a
							key={link.label}
							className={buttonVariants({
								variant: 'ghost',
								className: 'justify-start text-blue-50 hover:text-white hover:bg-white/10',
							})}
							href={link.href}
						>
							{link.label}
						</a>
					))}
				</div>
				<div className="flex flex-col gap-2">
					<Button
						variant="outline"
						className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
					>
						Sign In
					</Button>
					<Button className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none font-bold">
						Get Started
					</Button>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'bg-blue-600',
				'fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y border-blue-500 md:hidden',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=open]:fade-in-0 duration-200 ease-out',
					'size-full p-4',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}



