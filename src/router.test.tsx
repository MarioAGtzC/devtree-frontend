import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
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

  // Known bug (review #3): there is no catch-all route. Flip to `it` once fixed.
  it.fails('sends unmatched paths to the "User Not Found" page', async () => {
    visit('/foo/bar');

    expect(await screen.findByText('User Not Found', {}, { timeout: 200 })).toBeInTheDocument();
  });
});
