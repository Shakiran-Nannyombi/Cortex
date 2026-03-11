import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button Component', () => {
    it('renders with text content', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders with primary variant by default', () => {
        render(<Button>Primary</Button>);
        const button = screen.getByText('Primary');
        expect(button).toHaveClass('bg-primary-500');
    });

    it('renders with secondary variant', () => {
        render(<Button variant="secondary">Secondary</Button>);
        const button = screen.getByText('Secondary');
        expect(button).toHaveClass('bg-gray-200');
    });

    it('renders with danger variant', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByText('Delete');
        expect(button).toHaveClass('bg-red-500');
    });

    it('renders with ghost variant', () => {
        render(<Button variant="ghost">Ghost</Button>);
        const button = screen.getByText('Ghost');
        expect(button).toHaveClass('bg-transparent');
    });

    it('handles click events', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        render(<Button onClick={handleClick}>Click</Button>);

        await user.click(screen.getByText('Click'));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    it('disables when disabled prop is true', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        render(
            <Button disabled onClick={handleClick}>
                Disabled
            </Button>
        );

        const button = screen.getByText('Disabled');
        expect(button).toBeDisabled();
        await user.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('shows loading state', () => {
        render(<Button loading>Loading</Button>);
        const button = screen.getByText('Loading');
        expect(button).toBeDisabled();
        expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('renders as submit button', () => {
        render(<Button type="submit">Submit</Button>);
        const button = screen.getByText('Submit');
        expect(button).toHaveAttribute('type', 'submit');
    });
});
