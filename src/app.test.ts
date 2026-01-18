import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app';

describe('GET /', () => {
  it('should return hello world message', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, World!' });
  });
});
