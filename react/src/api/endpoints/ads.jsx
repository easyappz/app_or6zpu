import { apiRequest } from '../client';

export function listAds(filters = {}) {
  // Allowed filters per spec
  const query = {};
  if (filters.page !== undefined) query.page = filters.page;
  if (filters.page_size !== undefined) query.page_size = filters.page_size;
  if (filters.category_id !== undefined) query.category_id = filters.category_id;
  if (filters.price_min !== undefined) query.price_min = String(filters.price_min);
  if (filters.price_max !== undefined) query.price_max = String(filters.price_max);
  if (filters.date_from !== undefined) query.date_from = filters.date_from;
  if (filters.date_to !== undefined) query.date_to = filters.date_to;
  if (filters.location !== undefined) query.location = filters.location;
  if (filters.q !== undefined) query.q = filters.q;
  if (filters.ordering !== undefined) query.ordering = filters.ordering;
  return apiRequest('ads.list', { query });
}

export function createAd(data) {
  const body = {
    title: data.title,
    description: data.description,
    price: String(data.price),
    photos: Array.isArray(data.photos) ? data.photos : [],
    location: data.location,
    contact: data.contact,
    condition: data.condition,
    category_id: data.category_id,
  };
  return apiRequest('ads.create', { body });
}

export function getAd(pk) {
  return apiRequest('ads.retrieve', { pathParams: { pk } });
}

export function updateAd(pk, data) {
  const body = {};
  if (data.title !== undefined) body.title = data.title;
  if (data.description !== undefined) body.description = data.description;
  if (data.price !== undefined) body.price = String(data.price);
  if (data.photos !== undefined) body.photos = data.photos;
  if (data.location !== undefined) body.location = data.location;
  if (data.contact !== undefined) body.contact = data.contact;
  if (data.condition !== undefined) body.condition = data.condition;
  if (data.category_id !== undefined) body.category_id = data.category_id;
  return apiRequest('ads.update', { pathParams: { pk }, body });
}

export function deleteAd(pk) {
  return apiRequest('ads.delete', { pathParams: { pk } });
}

export function addFavorite(pk) {
  return apiRequest('ads.favorite.add', { pathParams: { pk } });
}

export function removeFavorite(pk) {
  return apiRequest('ads.favorite.remove', { pathParams: { pk } });
}
