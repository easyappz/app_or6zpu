import instance from './axios.js';

/**
 * GET /api/categories
 * Public categories list
 */
export async function fetchCategories() {
  const res = await instance.get('/api/categories');
  return res.data;
}
