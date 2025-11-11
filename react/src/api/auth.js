import instance from './axios';
import { ensureSpecReady } from './openapi';

export async function registerUser(payload) {
  await ensureSpecReady();
  // POST /api/auth/register
  return instance.post('/api/auth/register', payload);
}

export async function loginUser(payload) {
  await ensureSpecReady();
  // POST /api/auth/login
  return instance.post('/api/auth/login', payload);
}
