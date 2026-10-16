import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { AxiosError, type AxiosResponse } from 'axios';
import api from '../config/axios';
import { getUser, getUserByUsername, searchByUsername, updateProfile } from './DevTreeAPI';
import { makeUser } from '../test/utils';

vi.mock('../config/axios', () => ({
  default: Object.assign(vi.fn(), { patch: vi.fn(), post: vi.fn() }),
}));

const apiGet = api as unknown as Mock;
const apiPatch = api.patch as Mock;
const apiPost = api.post as Mock;

function httpError(status: number, data: unknown) {
  return new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, { status, data } as AxiosResponse);
}

const networkError = () => new AxiosError('Network Error', 'ERR_NETWORK');

beforeEach(() => vi.resetAllMocks());

describe('getUser', () => {
  it('returns the logged-in user', async () => {
    apiGet.mockResolvedValue({ data: makeUser() });
    await expect(getUser()).resolves.toMatchObject({ username: 'mario' });
  });

  it('throws an Error with the server message on 401', async () => {
    apiGet.mockRejectedValue(httpError(401, { error: 'Not authorized' }));
    await expect(getUser()).rejects.toThrow('Not authorized');
  });

  // Regression: a body without `error` produced an Error with an empty message, so toasts were blank.
  it('falls back to a readable message when the server sends no error text', async () => {
    apiGet.mockRejectedValue(httpError(500, ''));
    await expect(getUser()).rejects.toThrow('Something went wrong, please try again');
  });

  // Regression (review #2): errors without a response are swallowed and resolve to undefined.
  it('rejects when the API is unreachable', async () => {
    apiGet.mockRejectedValue(networkError());
    await expect(getUser()).rejects.toThrow();
  });
});

describe('getUserByUsername', () => {
  it('requests the public profile by username', async () => {
    apiGet.mockResolvedValue({ data: makeUser() });
    await getUserByUsername('mario');
    expect(apiGet).toHaveBeenCalledWith('/mario');
  });

  it('throws an Error with the server message on 404', async () => {
    apiGet.mockRejectedValue(httpError(404, { error: 'User not found' }));
    await expect(getUserByUsername('ghost')).rejects.toThrow('User not found');
  });

  // Regression (review #2): same swallowed network error, so UsernameView renders blank.
  it('rejects when the API is unreachable', async () => {
    apiGet.mockRejectedValue(networkError());
    await expect(getUserByUsername('mario')).rejects.toThrow();
  });
});

describe('updateProfile', () => {
  it('sends the user with PATCH /user', async () => {
    apiPatch.mockResolvedValue({ data: 'Profile updated' });
    await expect(updateProfile(makeUser())).resolves.toBe('Profile updated');
    expect(apiPatch).toHaveBeenCalledWith('/user', expect.objectContaining({ username: 'mario' }));
  });

  it('throws the validation errors array when the server returns field errors', async () => {
    const errors = [{ msg: 'Username is required' }];
    apiPatch.mockRejectedValue(httpError(400, { errors }));
    await expect(updateProfile(makeUser())).rejects.toEqual(errors);
  });

  // Regression: a body with neither `error` nor `errors` made it throw undefined, crashing onError.
  it('rejects with a readable Error when the server body has no error fields', async () => {
    apiPatch.mockRejectedValue(httpError(500, '<html>Internal Server Error</html>'));
    await expect(updateProfile(makeUser())).rejects.toThrow('Something went wrong, please try again');
  });
});

describe('searchByUsername', () => {
  it('returns the availability message', async () => {
    apiPost.mockResolvedValue({ data: 'mario is available' });
    await expect(searchByUsername('mario')).resolves.toBe('mario is available');
    expect(apiPost).toHaveBeenCalledWith('/search', { username: 'mario' });
  });

  it('wraps a single server error into a [{ msg }] array', async () => {
    apiPost.mockRejectedValue(httpError(409, { error: 'Username taken' }));
    await expect(searchByUsername('mario')).rejects.toEqual([{ msg: 'Username taken' }]);
  });
});
