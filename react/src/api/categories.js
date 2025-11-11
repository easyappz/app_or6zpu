import { getSpec, findOperationPath, requestBySpec } from './spec';

export async function listCategories() {
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Categories',
    method: 'get',
    summary: 'Список категорий',
  });
  const res = await requestBySpec({ method: 'get', path, op });
  return res.data;
}
