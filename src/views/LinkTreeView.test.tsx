import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import LinkTreeView from './LinkTreeView';
import { updateProfile } from '../api/DevTreeAPI';
import { cachedLinks, createTestQueryClient, makeUser } from '../test/utils';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('../api/DevTreeAPI', () => ({ updateProfile: vi.fn() }));

function setup() {
  const queryClient = createTestQueryClient();
  queryClient.setQueryData(['user'], makeUser());
  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <LinkTreeView />
    </QueryClientProvider>
  );
  const urlInput = (name: string) => container.querySelector<HTMLInputElement>(`input[type="text"][name="${name}"]`)!;
  // Switches render in the order of data/social.ts
  const order = ['facebook', 'github', 'instagram', 'x', 'youtube', 'tiktok', 'twitch', 'linkedin'];
  const toggle = (name: string) => screen.getAllByRole('switch')[order.indexOf(name)];
  return { queryClient, urlInput, toggle, user: userEvent.setup() };
}

beforeEach(() => vi.clearAllMocks());

describe('LinkTreeView', () => {
  it('enables a link with a valid URL and adds it to the cache with id 1', async () => {
    const { queryClient, urlInput, toggle, user } = setup();

    await user.type(urlInput('github'), 'https://github.com/mario');
    await user.click(toggle('github'));

    expect(toggle('github')).toHaveAttribute('aria-checked', 'true');
    expect(cachedLinks(queryClient)).toEqual([
      { name: 'github', url: 'https://github.com/mario', enabled: true, id: 1 },
    ]);
  });

  it('refuses to enable a link with an invalid URL', async () => {
    const { queryClient, urlInput, toggle, user } = setup();

    await user.type(urlInput('github'), 'not a url');
    await user.click(toggle('github'));

    expect(toast.error).toHaveBeenCalledWith('Not a valid URL', expect.anything());
    expect(toggle('github')).toHaveAttribute('aria-checked', 'false');
    expect(cachedLinks(queryClient).filter(l => l.enabled)).toHaveLength(0);
  });

  it('disables an enabled link and sets its id to 0', async () => {
    const { queryClient, urlInput, toggle, user } = setup();

    await user.type(urlInput('github'), 'https://github.com/mario');
    await user.click(toggle('github'));
    await user.click(toggle('github'));

    expect(toggle('github')).toHaveAttribute('aria-checked', 'false');
    expect(cachedLinks(queryClient)).toEqual([
      { name: 'github', url: 'https://github.com/mario', enabled: false, id: 0 },
    ]);
  });

  // Regression (review #1): disabling a link never renumbers the others, so the next
  // enabled link reuses an id and dnd-kit gets duplicate keys.
  it('keeps enabled link ids unique after disabling and re-enabling links', async () => {
    const { queryClient, urlInput, toggle, user } = setup();
    const enable = async (name: string) => {
      await user.type(urlInput(name), `https://${name}.com/mario`);
      await user.click(toggle(name));
    };

    await enable('facebook'); // id 1
    await enable('github'); // id 2
    await enable('instagram'); // id 3
    await user.click(toggle('facebook')); // disable
    await enable('x'); // used to reuse id 3, a duplicate of instagram

    const ids = cachedLinks(queryClient).filter(l => l.enabled).map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // Regression (found while writing tests): toggling any link resets the inputs from the
  // cache, wiping URLs typed into links that aren't enabled yet.
  it('keeps URLs typed into other links when toggling one', async () => {
    const { urlInput, toggle, user } = setup();

    await user.type(urlInput('x'), 'https://x.com/mario');
    await user.type(urlInput('github'), 'https://github.com/mario');
    await user.click(toggle('github'));

    expect(urlInput('x')).toHaveValue('https://x.com/mario');
  });

  // Regression (review #4): URL validation also runs when switching a link off.
  it('lets the user disable a link after clearing its URL', async () => {
    const { urlInput, toggle, user } = setup();

    await user.type(urlInput('github'), 'https://github.com/mario');
    await user.click(toggle('github'));
    await user.clear(urlInput('github'));
    await user.click(toggle('github'));

    expect(toggle('github')).toHaveAttribute('aria-checked', 'false');
  });

  it('stores the new URL when a link is disabled, edited and enabled again', async () => {
    const { queryClient, urlInput, toggle, user } = setup();

    await user.type(urlInput('github'), 'https://github.com/old');
    await user.click(toggle('github'));
    await user.click(toggle('github'));
    await user.clear(urlInput('github'));
    await user.type(urlInput('github'), 'https://github.com/new');
    await user.click(toggle('github'));

    expect(cachedLinks(queryClient)).toEqual([
      { name: 'github', url: 'https://github.com/new', enabled: true, id: 1 },
    ]);
  });

  it('stores URL edits of an enabled link', async () => {
    const { queryClient, urlInput, toggle, user } = setup();

    await user.type(urlInput('github'), 'https://github.com/old');
    await user.click(toggle('github'));
    await user.clear(urlInput('github'));
    await user.type(urlInput('github'), 'https://github.com/new');

    expect(cachedLinks(queryClient)[0].url).toBe('https://github.com/new');
  });

  it('does not save while an enabled link has an invalid URL', async () => {
    const { urlInput, toggle, user } = setup();

    await user.type(urlInput('github'), 'https://github.com/mario');
    await user.click(toggle('github'));
    await user.clear(urlInput('github'));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(toast.error).toHaveBeenCalledWith('Not a valid URL: github', expect.anything());
    expect(updateProfile).not.toHaveBeenCalled();
  });

  // Regression: URLs typed into links that were never enabled were not sent on save.
  it('stores URLs typed into disabled links', async () => {
    const { queryClient, urlInput, user } = setup();

    await user.type(urlInput('x'), 'https://x.com/mario');

    expect(cachedLinks(queryClient)).toEqual([
      { name: 'x', url: 'https://x.com/mario', enabled: false, id: 0 },
    ]);
  });

  it('keeps the dragged order when another link is enabled', async () => {
    const { queryClient, urlInput, toggle, user } = setup();
    // Order as DevTree's drag handler leaves it: github dragged above facebook, ids not yet renumbered
    queryClient.setQueryData(['user'], makeUser({ links: JSON.stringify([
      { name: 'github', url: 'https://github.com/mario', enabled: true, id: 2 },
      { name: 'facebook', url: 'https://facebook.com/mario', enabled: true, id: 1 },
    ]) }));

    await user.type(urlInput('x'), 'https://x.com/mario');
    await user.click(toggle('x'));

    expect(cachedLinks(queryClient).map(l => [l.name, l.id])).toEqual([
      ['github', 1], ['facebook', 2], ['x', 3],
    ]);
  });

  it('does not send half-typed URLs of disabled links', async () => {
    vi.mocked(updateProfile).mockResolvedValue(makeUser());
    const { urlInput, toggle, user } = setup();

    await user.type(urlInput('x'), 'htt');
    await user.type(urlInput('github'), 'https://github.com/mario');
    await user.click(toggle('github'));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => expect(updateProfile).toHaveBeenCalled());
    const sent = vi.mocked(updateProfile).mock.calls[0][0];
    expect(JSON.parse(sent.links).map((l: { name: string }) => l.name)).toEqual(['github']);
  });

  it('saves the cached user, including links, when clicking Save changes', async () => {
    vi.mocked(updateProfile).mockResolvedValue(makeUser());
    const { urlInput, toggle, user } = setup();

    await user.type(urlInput('github'), 'https://github.com/mario');
    await user.click(toggle('github'));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => expect(updateProfile).toHaveBeenCalled());
    const sent = vi.mocked(updateProfile).mock.calls[0][0];
    expect(JSON.parse(sent.links)).toEqual([
      { name: 'github', url: 'https://github.com/mario', enabled: true, id: 1 },
    ]);
  });
});
