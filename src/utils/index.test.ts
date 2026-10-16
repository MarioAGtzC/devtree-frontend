import { describe, it, expect } from 'vitest';
import { classNames, isValidUrl } from '.';

describe('isValidUrl', () => {
  it('accepts a full URL with protocol', () => {
    expect(isValidUrl('https://github.com/mario')).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(isValidUrl('')).toBe(false);
  });

  it('rejects a URL without protocol', () => {
    expect(isValidUrl('github.com/mario')).toBe(false);
  });
});

describe('classNames', () => {
  it('joins classes and drops empty ones', () => {
    expect(classNames('a', '', 'b')).toBe('a b');
  });
});
