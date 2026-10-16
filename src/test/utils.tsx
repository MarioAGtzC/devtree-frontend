import { QueryClient } from '@tanstack/react-query';
import type { SocialNetwork, User } from '../types';

export function createTestQueryClient() {
  // retryDelay 0 so the views' `retry: 1` doesn't add a 1s wait to every error test
  return new QueryClient({ defaultOptions: { queries: { retryDelay: 0 }, mutations: { retry: false } } });
}

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    _id: '1',
    name: 'Mario',
    email: 'mario@example.com',
    username: 'mario',
    description: 'Dev',
    image: '',
    links: '[]',
    ...overrides,
  };
}

export function cachedLinks(queryClient: QueryClient): SocialNetwork[] {
  return JSON.parse(queryClient.getQueryData<User>(['user'])!.links);
}
