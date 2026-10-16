import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import SearchForm from './SearchForm';
import { searchByUsername } from '../api/DevTreeAPI';
import { createTestQueryClient } from '../test/utils';

vi.mock('../api/DevTreeAPI', () => ({ searchByUsername: vi.fn() }));

function setup() {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter>
        <SearchForm />
      </MemoryRouter>
    </QueryClientProvider>
  );
  return userEvent.setup();
}

async function search(user: ReturnType<typeof userEvent.setup>, value: string) {
  await user.type(screen.getByLabelText('devtree.greenie.dev/'), value);
  await user.click(screen.getByRole('button', { name: /get my devtree/i }));
}

beforeEach(() => vi.clearAllMocks());

describe('SearchForm', () => {
  it('slugifies the handle before searching', async () => {
    vi.mocked(searchByUsername).mockResolvedValue('mario-g is available');
    const user = setup();

    await search(user, 'Mario G');

    await waitFor(() => expect(searchByUsername).toHaveBeenCalled());
    expect(vi.mocked(searchByUsername).mock.calls[0][0]).toBe('mario-g');
  });

  it('shows a register link when the handle is free', async () => {
    vi.mocked(searchByUsername).mockResolvedValue('mario is available');
    const user = setup();

    await search(user, 'mario');

    expect(await screen.findByText(/mario is available/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/auth/register');
  });

  it('shows the server message when the handle is taken', async () => {
    vi.mocked(searchByUsername).mockRejectedValue([{ msg: 'Username taken' }]);
    const user = setup();

    await search(user, 'mario');

    expect(await screen.findByText('Username taken')).toBeInTheDocument();
  });

  it('requires a handle', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /get my devtree/i }));

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(searchByUsername).not.toHaveBeenCalled();
  });
});
