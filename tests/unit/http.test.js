import { describe, it, expect } from 'vitest';
import httpClient from '../../src/api/http.js';

describe('httpClient', () => {
  it('has a configured timeout', () => {
    expect(httpClient.defaults.timeout).toBe(5000);
  });

  it('has a User-Agent header with version from package.json', () => {
    const userAgent = httpClient.defaults.headers['User-Agent'];
    expect(userAgent).toMatch(/^weather-cli\/\d+\.\d+\.\d+$/);
  });

  it('does not have a function as X-Request-ID default header', () => {
    // X-Request-ID should be set per-request via interceptor, not as a static default
    const xRequestId = httpClient.defaults.headers['X-Request-ID'];
    expect(typeof xRequestId).not.toBe('function');
  });

  it('has request interceptors configured', () => {
    // Should have at least the X-Request-ID interceptor
    expect(httpClient.interceptors.request.handlers.length).toBeGreaterThanOrEqual(1);
  });

  it('has response interceptors configured', () => {
    // Should have the rate limit interceptor
    expect(httpClient.interceptors.response.handlers.length).toBeGreaterThanOrEqual(1);
  });
});
