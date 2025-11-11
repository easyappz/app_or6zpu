import { getSpec, findOperationPath, requestBySpec } from './spec';

export async function getMe() {
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Members',
    method: 'get',
    summary: 'Текущий профиль',
  });
  const res = await requestBySpec({ method: 'get', path, op });
  return res.data;
}

export async function updateMe(data) {
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Members',
    method: 'put',
    summary: 'Обновить профиль',
  });
  const res = await requestBySpec({ method: 'put', path, body: data, op });
  return res.data;
}

export async function getMyAds(params = {}) {
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Members',
    method: 'get',
    summary: 'Мои объявления',
  });
  const res = await requestBySpec({ method: 'get', path, query: params, op });
  return res.data;
}

export async function getMyFavorites(params = {}) {
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Members',
    method: 'get',
    summary: 'Мои избранные объявления',
  });
  const res = await requestBySpec({ method: 'get', path, query: params, op });
  return res.data;
}
