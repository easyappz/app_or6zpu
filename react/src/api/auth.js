import { getSpec, findOperationPath, requestBySpec } from './spec';

// Auth: register
export async function register(payload) {
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Auth',
    method: 'post',
    summary: 'Регистрация нового пользователя',
  });
  const res = await requestBySpec({ method: 'post', path, body: payload, op });
  return res.data;
}

// Auth: login
export async function login(payload) {
  await getSpec();
  const { path, op } = await findOperationPath({
    tag: 'Auth',
    method: 'post',
    summary: 'Вход по email и паролю',
  });
  const res = await requestBySpec({ method: 'post', path, body: payload, op });
  return res.data;
}
