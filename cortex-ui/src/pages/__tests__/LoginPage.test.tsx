import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../__tests__/utils';
import LoginPage from '../LoginPage';

describe('LoginPage Integration', () => {
    it('renders login form', () => {
        renderWithProviders(<LoginPage />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('validates email field', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        const submitButton = screen.getByRole('button', { name: /login/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        });
    });

    it('validates password field', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, 'test@example.com');

        const submitButton = screen.getByRole('button', { name: /login/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });

    it('submits form with valid credentials', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    });

    it('displays loading state during submission', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        expect(submitButton).toBeDisabled();
    });

    it('displays error message on failed login', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        await user.type(emailInput, 'wrong@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });

    it('displays link to registration page', () => {
        renderWithProviders(<LoginPage />);
        const registerLink = screen.getByRole('link', { name: /register/i });
        expect(registerLink).toBeInTheDocument();
        expect(registerLink).toHaveAttribute('href', '/register');
    });
});
