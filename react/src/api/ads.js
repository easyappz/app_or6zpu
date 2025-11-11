import instance from './axios';
import { getSpec } from './openapi';

// Public: list ads with filters — returns paginated data per OpenAPI
export async function listAds(filters = {}) {
  await getSpec();
  const params = {};
  if (filters.page !== undefined) params.page = filters.page;
  if (filters.page_size !== undefined) params.page_size = filters.page_size;
  if (filters.category_id !== undefined) params.category_id = filters.category_id;
  if (filters.price_min !== undefined) params.price_min = String(filters.price_min);
  if (filters.price_max !== undefined) params.price_max = String(filters.price_max);
  if (filters.date_from !== undefined) params.date_from = filters.date_from;
  if (filters.date_to !== undefined) params.date_to = filters.date_to;
  if (filters.location !== undefined) params.location = filters.location;
  if (filters.q !== undefined) params.q = filters.q;
  if (filters.ordering !== undefined) params.ordering = filters.ordering;
  const res = await instance.get('/api/ads', { params });
  return res.data;
}

// Get ad (Axios response) — used by AdView.jsx as `{ data } = await getAdById(id)`
export async function getAdById(pk) {
  await getSpec();
  return instance.get(`/api/ads/${encodeURIComponent(pk)}`);
}

// Get ad (plain data) — used by AdEdit.jsx as `const ad = await getAd(id)`
export async function getAd(pk) {
  await getSpec();
  const res = await instance.get(`/api/ads/${encodeURIComponent(pk)}`);
  return res.data;
}

// Create ad — used by AdNew.jsx, must return plain data
export async function createAd(payload) {
  await getSpec();
  const res = await instance.post('/api/ads', payload);
  return res.data;
}

// Update ad — used by AdEdit.jsx, must return plain data
export async function updateAd(pk, payload) {
  await getSpec();
  const res = await instance.put(`/api/ads/${encodeURIComponent(pk)}`, payload);
  return res.data;
}

// Delete ad — used by AdView.jsx (kept as is)
export async function deleteAd(pk) {
  await getSpec();
  return instance.delete(`/api/ads/${encodeURIComponent(pk)}`);
}

// Favorites — used by AdView.jsx (kept as is)
export async function addFavorite(pk) {
  await getSpec();
  return instance.post(`/api/ads/${encodeURIComponent(pk)}/favorite`);
}

export async function removeFavorite(pk) {
  await getSpec();
  return instance.delete(`/api/ads/${encodeURIComponent(pk)}/favorite`);
}
