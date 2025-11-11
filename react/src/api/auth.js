import instance from './axios';
import { ensurePath } from './openapi';

export async function login(payload) {
  await ensurePath('post', '/api/auth/login');
  return instance.post('/api/auth/login', payload);
}

export async function register(payload) {
  await ensurePath('post', '/api/auth/register');
  return instance.post('/api/auth/register', payload);
}
