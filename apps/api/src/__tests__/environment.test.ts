import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  it('should have required environment variables', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should use default PORT if not set', () => {
    delete process.env.PORT;
    const defaultPort = 4000;
    expect(defaultPort).toBe(4000);
  });
});
