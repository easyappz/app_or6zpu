import { apiRequest } from '../client';

export async function getMyProfile() {
  return apiRequest('members.me.get');
}

export async function updateMyProfile(payload) {
  // payload: { name?, phone?, avatar_url? }
  const body = {};
  if (payload.name !== undefined) body.name = payload.name;
  if (payload.phone !== undefined) body.phone = payload.phone;
  if (payload.avatar_url !== undefined) body.avatar_url = payload.avatar_url;
  return apiRequest('members.me.put', { body });
}

export async function listMyAds(params = {}) {
  // params: { page?, page_size? }
  const query = {};
  if (params.page !== undefined) query.page = params.page;
  if (params.page_size !== undefined) query.page_size = params.page_size;
  return apiRequest('members.me.ads', { query });
}

export async function listMyFavorites(params = {}) {
  const query = {};
  if (params.page !== undefined) query.page = params.page;
  if (params.page_size !== undefined) query.page_size = params.page_size;
  return apiRequest('members.me.favorites', { query });
}
