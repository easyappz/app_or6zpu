import instance from './axios';
import { getSpec } from './openapi';

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
