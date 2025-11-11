import instance from './axios.js';

/**
 * Ads API following openapi.yml
 */

// GET /api/ads/{pk}
export async function getAd(id) {
  const res = await instance.get(`/api/ads/${id}`);
  return res.data;
}

// POST /api/ads
export async function createAd(payload) {
  const res = await instance.post('/api/ads', payload);
  return res.data;
}

// PUT /api/ads/{pk}
export async function updateAd(id, payload) {
  const res = await instance.put(`/api/ads/${id}`, payload);
  return res.data;
}
