import instance from './axios';

// GET /api/members/me — as per openapi.yml
export async function getMe() {
  const res = await instance.get('/api/members/me');
  return res.data;
}
