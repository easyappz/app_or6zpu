import instance from './axios';
import { ensurePath } from './openapi';

export async function getMe() {
  await ensurePath('get', '/api/members/me');
  return instance.get('/api/members/me');
}
