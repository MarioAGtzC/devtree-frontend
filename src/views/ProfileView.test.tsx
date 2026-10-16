import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProfileView from './ProfileView';
import { updateProfile } from '../api/DevTreeAPI';
import type { User } from '../types';
import { createTestQueryClient, makeUser } from '../test/utils';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('../api/DevTreeAPI', () => ({ updateProfile: vi.fn(), uploadimage: vi.fn() }));

function setup() {
  const queryClient = createTestQueryClient();
  queryClient.setQueryData(['user'], makeUser());
  render(
    <QueryClientProvider client={queryClient}>
      <ProfileView />
    </QueryClientProvider>
  );
  return { queryClient, user: userEvent.setup() };
}

async function changeUsername(user: ReturnType<typeof userEvent.setup>, value: string) {
  const input = screen.getByPlaceholderText('Username or handle');
  await user.clear(input);
  await user.type(input, value);
  await user.click(screen.getByRole('button', { name: /save changes/i }));
}

beforeEach(() => vi.clearAllMocks());

describe('ProfileView', () => {
  it('pre-fills the form from the cached user', () => {
    setup();
    expect(screen.getByPlaceholderText('Username or handle')).toHaveValue('mario');
    expect(screen.getByPlaceholderText('Your description')).toHaveValue('Dev');
  });

  it('requires a username', async () => {
    const { user } = setup();
    await user.clear(screen.getByPlaceholderText('Username or handle'));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it('sends the new username and description to the API', async () => {
    vi.mocked(updateProfile).mockResolvedValue(makeUser());
    const { user } = setup();

    await changeUsername(user, 'mario-dev');

    await waitFor(() => expect(updateProfile).toHaveBeenCalled());
    expect(vi.mocked(updateProfile).mock.calls[0][0]).toMatchObject({ username: 'mario-dev', description: 'Dev' });
  });

  // Known bug (review #6): the form mutates the cached user in place, so a rejected
  // update still shows up in the preview. Flip to `it` once fixed.
  it.fails('keeps the cached username when the server rejects the change', async () => {
    vi.mocked(updateProfile).mockRejectedValue(new Error('Username taken'));
    const { queryClient, user } = setup();

    await changeUsername(user, 'taken');

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Username taken', expect.anything()));
    expect(queryClient.getQueryData<User>(['user'])!.username).toBe('mario');
  });
});
