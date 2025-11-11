import { apiRequest } from '../client';

export async function listCategories() {
  return apiRequest('categories.list');
}

export async function getCategory(pk) {
  return apiRequest('categories.retrieve', { pathParams: { pk } });
}
