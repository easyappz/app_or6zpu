import instance from './axios';
import { ensureSpecReady } from './openapi';

export async function getMe() {
  await ensureSpecReady();
  // GET /api/members/me
  return instance.get('/api/members/me');
}

export async function updateMe(payload) {
  await ensureSpecReady();
  // PUT /api/members/me
  return instance.put('/api/members/me', payload);
}
