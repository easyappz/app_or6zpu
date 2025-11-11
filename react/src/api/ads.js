import { getSpec, findOperationPath, requestBySpec } from './spec';

export async function listAds(filters = {}) {
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Ads',
    method: 'get',
    summary: 'Поиск и список объявлений',
  });
  const res = await requestBySpec({ method: 'get', path, query: filters, op });
  return res.data;
}

export async function getAd(id) {
  if (id === undefined || id === null) throw new Error('id is required');
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Ads',
    method: 'get',
    summary: 'Получить объявление',
  });
  const res = await requestBySpec({ method: 'get', path, pathParams: { pk: id }, op });
  return res.data;
}

export async function createAd(data) {
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Ads',
    method: 'post',
    summary: 'Создать объявление',
  });
  const res = await requestBySpec({ method: 'post', path, body: data, op });
  return res.data;
}

export async function updateAd(id, data) {
  if (id === undefined || id === null) throw new Error('id is required');
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Ads',
    method: 'put',
    summary: 'Обновить объявление',
  });
  const res = await requestBySpec({ method: 'put', path, pathParams: { pk: id }, body: data, op });
  return res.data;
}

export async function deleteAd(id) {
  if (id === undefined || id === null) throw new Error('id is required');
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Ads',
    method: 'delete',
    summary: 'Удалить объявление',
  });
  const res = await requestBySpec({ method: 'delete', path, pathParams: { pk: id }, op });
  return res.status;
}

export async function favoriteAd(id) {
  if (id === undefined || id === null) throw new Error('id is required');
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Ads',
    method: 'post',
    summary: 'Добавить в избранное',
  });
  const res = await requestBySpec({ method: 'post', path, pathParams: { pk: id }, op });
  return res.status;
}

export async function unfavoriteAd(id) {
  if (id === undefined || id === null) throw new Error('id is required');
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Ads',
    method: 'delete',
    summary: 'Удалить из избранного',
  });
  const res = await requestBySpec({ method: 'delete', path, pathParams: { pk: id }, op });
  return res.status;
}
