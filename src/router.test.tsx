import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider, onlineManager } from '@tanstack/react-query';
import Router from './router';
import { getUser, getUserByUsername } from './api/DevTreeAPI';
import { createTestQueryClient, makeUser } from './test/utils';

vi.mock('./api/DevTreeAPI', () => ({
  getUser: vi.fn(),
  getUserByUsername: vi.fn(),
  searchByUsername: vi.fn(),
  updateProfile: vi.fn(),
  uploadimage: vi.fn(),
}));

function visit(path: string) {
  window.history.pushState({}, '', path);
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Router />
    </QueryClientProvider>
  );
}

beforeEach(() => vi.clearAllMocks());

describe('routing', () => {
  it('redirects /admin to login when the user cannot be loaded', async () => {
    vi.mocked(getUser).mockRejectedValue(new Error('Not authorized'));
    visit('/admin');

    expect(await screen.findByRole('heading', { name: 'Log in' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/auth/login');
  });

  it('shows the dashboard for a logged-in user', async () => {
    vi.mocked(getUser).mockResolvedValue(makeUser());
    visit('/admin');

    expect(await screen.findByText('Visit my profile: /mario')).toBeInTheDocument();
  });

  // Regression: logout left the user query in error, so the next login bounced back to /auth/login.
  it('shows the dashboard when logging in again after a logout', async () => {
    vi.mocked(getUser).mockResolvedValue(makeUser());
    localStorage.setItem('AUTH_TOKEN', 'token');
    visit('/admin');
    await screen.findByText('Visit my profile: /mario');

    await userEvent.click(screen.getByRole('button', { name: /log out/i }));
    expect(await screen.findByRole('heading', { name: 'Log in' })).toBeInTheDocument();
    expect(localStorage.getItem('AUTH_TOKEN')).toBeNull();

    act(() => {
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(await screen.findByText('Visit my profile: /mario')).toBeInTheDocument();
  });

  // Regression: a reconnect refetched the user and overwrote unsaved edits in the cache.
  it('does not refetch the logged-in user when the network reconnects', async () => {
    vi.mocked(getUser).mockResolvedValue(makeUser());
    visit('/admin');
    await screen.findByText('Visit my profile: /mario');

    await act(async () => {
      onlineManager.setOnline(false);
      onlineManager.setOnline(true);
    });

    expect(getUser).toHaveBeenCalledTimes(1);
  });

  it('shows only enabled links on a public profile', async () => {
    vi.mocked(getUserByUsername).mockResolvedValue(makeUser({
      links: JSON.stringify([
        { id: 1, name: 'github', url: 'https://github.com/mario', enabled: true },
        { id: 0, name: 'x', url: 'https://x.com/mario', enabled: false },
      ]),
    }));
    visit('/mario');

    expect(await screen.findByRole('link', { name: /visit my: github/i })).toHaveAttribute('href', 'https://github.com/mario');
    expect(screen.queryByRole('link', { name: /visit my: x/i })).not.toBeInTheDocument();
  });

  it('sends unknown usernames to the "User Not Found" page', async () => {
    vi.mocked(getUserByUsername).mockRejectedValue(new Error('User not found'));
    visit('/ghost');

    expect(await screen.findByText('User Not Found')).toBeInTheDocument();
  });

  // Regression (review #3): there is no catch-all route.
  it('sends unmatched paths to the "User Not Found" page', async () => {
    visit('/foo/bar');

    expect(await screen.findByText('User Not Found', {}, { timeout: 200 })).toBeInTheDocument();
  });

  // Regression: the redirect pushed a history entry, so Back landed on the bad URL and redirected again.
  it('replaces the unmatched path in history instead of pushing /404', async () => {
    const length = window.history.length;
    visit('/foo/bar'); // pushes one entry itself

    await screen.findByText('User Not Found');
    expect(window.location.pathname).toBe('/404');
    expect(window.history.length).toBe(length + 1);
  });
});
