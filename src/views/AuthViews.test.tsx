import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import api from '../config/axios';
import LoginView from './LoginView';
import RegisterView from './RegisterView';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('../config/axios', () => ({ default: { post: vi.fn() } }));

const apiPost = api.post as Mock;

function renderAt(entry: string | { pathname: string; state: unknown }) {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path='/auth/login' element={<LoginView />} />
        <Route path='/auth/register' element={<RegisterView />} />
        <Route path='/admin' element={<p>Admin page</p>} />
      </Routes>
    </MemoryRouter>
  );
  return userEvent.setup();
}

beforeEach(() => vi.clearAllMocks());

describe('LoginView', () => {
  it('rejects an email without @', async () => {
    const user = renderAt('/auth/login');
    await user.type(screen.getByLabelText('E-mail'), 'mario');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
    expect(apiPost).not.toHaveBeenCalled();
  });

  it('stores the token and goes to /admin on success', async () => {
    apiPost.mockResolvedValue({ data: 'jwt-token' });
    const user = renderAt('/auth/login');
    await user.type(screen.getByLabelText('E-mail'), 'mario@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Admin page')).toBeInTheDocument();
    expect(localStorage.getItem('AUTH_TOKEN')).toBe('jwt-token');
  });

  // Known bug (review #7): the email regex isn't anchored, so any text containing
  // an email-like substring passes. Flip to `it` once fixed.
  it.fails('rejects text that only contains an email', async () => {
    const user = renderAt('/auth/login');
    await user.type(screen.getByLabelText('E-mail'), 'junk a@b.c junk');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
  });
});

describe('RegisterView', () => {
  async function fillForm(user: ReturnType<typeof userEvent.setup>, password: string, confirmation = password) {
    await user.type(screen.getByLabelText('Name'), 'Mario');
    await user.type(screen.getByLabelText('E-mail'), 'mario@example.com');
    await user.type(screen.getByLabelText('Username'), 'mario');
    await user.type(screen.getByLabelText('Password'), password);
    await user.type(screen.getByLabelText('Repeat Password'), confirmation);
    await user.click(screen.getByRole('button', { name: /create account/i }));
  }

  it('pre-fills the username chosen on the home page search', () => {
    renderAt({ pathname: '/auth/register', state: { username: 'mario' } });
    expect(screen.getByLabelText('Username')).toHaveValue('mario');
  });

  it.each(['Sh1!a', 'nouppercase1!', 'NOLOWERCASE1!', 'NoNumbers!!', 'NoSymbols123'])(
    'rejects the weak password %s',
    async (password) => {
      const user = renderAt('/auth/register');
      await fillForm(user, password);

      expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      expect(apiPost).not.toHaveBeenCalled();
    }
  );

  it('rejects a confirmation that does not match', async () => {
    const user = renderAt('/auth/register');
    await fillForm(user, 'Secret123!', 'Secret123?');

    expect(await screen.findByText("The passwords don't match")).toBeInTheDocument();
    expect(apiPost).not.toHaveBeenCalled();
  });

  it('registers and goes to login with a valid form', async () => {
    apiPost.mockResolvedValue({ data: 'Account created' });
    const user = renderAt('/auth/register');
    await fillForm(user, 'Secret123!');

    await waitFor(() => expect(apiPost).toHaveBeenCalledWith('/auth/register', expect.objectContaining({
      email: 'mario@example.com',
      username: 'mario',
    })));
    expect(await screen.findByRole('heading', { name: 'Log in' })).toBeInTheDocument();
  });
});
