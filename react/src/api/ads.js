import instance from './axios';
import { getSpec } from './openapi';

// Ensure we respect OpenAPI-defined params
const ADS_LIST_PATH = '/api/ads';

export async function listAds(params = {}) {
  // Validate against spec minimally (keys only)
  await getSpec();
  const allowed = [
    'page',
    'page_size',
    'category_id',
    'price_min',
    'price_max',
    'date_from',
    'date_to',
    'location',
    'q',
    'ordering',
  ];
  const query = {};
  for (const key of allowed) {
    const v = params[key];
    if (v !== undefined && v !== null && String(v).length > 0) {
      query[key] = v;
    }
  }
  const res = await instance.get(ADS_LIST_PATH, { params: query });
  return res.data; // PaginatedAdList
}

export async function addFavorite(adId) {
  if (!adId) throw new Error('adId is required');
  const url = `/api/ads/${adId}/favorite`;
  const res = await instance.post(url);
  return res.status; // 204 expected
}

export async function removeFavorite(adId) {
  if (!adId) throw new Error('adId is required');
  const url = `/api/ads/${adId}/favorite`;
  const res = await instance.delete(url);
  return res.status; // 204 expected
}
