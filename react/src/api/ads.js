import instance from './axios';
import { getSpec } from './openapi';

// Ads API according to openapi.yml
export async function getAdById(pk) {
  await getSpec();
  return instance.get(`/api/ads/${encodeURIComponent(pk)}`);
}

export async function deleteAd(pk) {
  await getSpec();
  return instance.delete(`/api/ads/${encodeURIComponent(pk)}`);
}

export async function addFavorite(pk) {
  await getSpec();
  return instance.post(`/api/ads/${encodeURIComponent(pk)}/favorite`);
}

export async function removeFavorite(pk) {
  await getSpec();
  return instance.delete(`/api/ads/${encodeURIComponent(pk)}/favorite`);
}
