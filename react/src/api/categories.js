import instance from './axios';
import { getSpec } from './openapi';

const CATEGORIES_PATH = '/api/categories';

export async function listCategories() {
  await getSpec();
  const res = await instance.get(CATEGORIES_PATH);
  return res.data; // Category[]
}
