import instance from './axios';
import { resolveOperation } from './openapi';

function buildPath(pathTemplate, pathParams) {
  if (!pathParams) return pathTemplate;
  let result = '';
  let i = 0;
  while (i < pathTemplate.length) {
    const ch = pathTemplate[i];
    if (ch === '{') {
      const end = pathTemplate.indexOf('}', i + 1);
      if (end === -1) {
        throw new Error('Invalid path template: missing }');
      }
      const name = pathTemplate.slice(i + 1, end);
      if (!(name in pathParams)) {
        throw new Error(`Missing path param: ${name}`);
      }
      const value = pathParams[name];
      result += encodeURIComponent(String(value));
      i = end + 1;
    } else {
      result += ch;
      i += 1;
    }
  }
  return result;
}

function buildQuery(query) {
  if (!query) return '';
  const keys = Object.keys(query);
  const parts = [];
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    const v = query[k];
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) {
      for (let j = 0; j < v.length; j += 1) {
        const sv = v[j];
        if (sv === undefined || sv === null || sv === '') continue;
        parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(sv))}`);
      }
    } else {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    }
  }
  if (parts.length === 0) return '';
  return `?${parts.join('&')}`;
}

function emitValidation(status, data) {
  try {
    window.dispatchEvent(new CustomEvent('easyappz:validation', { detail: { status, data } }));
  } catch (e) {
    // no-op
  }
}

export async function apiRequest(opKey, { pathParams, query, body, headers } = {}) {
  const { path, method, op } = await resolveOperation(opKey);
  const secured = Array.isArray(op.security) && op.security.length > 0;

  if (secured) {
    const token = localStorage.getItem('token');
    if (!token) {
      const data = { detail: 'Требуется авторизация' };
      emitValidation(401, data);
      const err = new Error('Authorization token is missing');
      err.response = { status: 401, data };
      throw err;
    }
  }

  const url = buildPath(path, pathParams) + buildQuery(query);

  try {
    const response = await instance.request({
      url,
      method,
      data: body,
      headers: headers || {},
    });
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    if (status && data) emitValidation(status, data);
    throw error;
  }
}
