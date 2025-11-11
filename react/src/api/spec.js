import yaml from 'js-yaml';
import instance from './axios';

let cachedSpec = null;
let specPromise = null;

export async function getSpec() {
  if (cachedSpec) return cachedSpec;
  if (!specPromise) {
    specPromise = fetch('/openapi.yml', { method: 'GET' })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load openapi.yml: ${res.status}`);
        }
        const text = await res.text();
        const doc = yaml.load(text);
        cachedSpec = doc;
        return cachedSpec;
      })
      .catch((err) => {
        specPromise = null;
        throw err;
      });
  }
  return specPromise;
}

function hasTag(op, tag) {
  if (!op || !op.tags) return false;
  for (let i = 0; i < op.tags.length; i += 1) {
    if (op.tags[i] === tag) return true;
  }
  return false;
}

function summaryMatches(op, summary) {
  if (!op || !op.summary) return false;
  // Avoid regex. Exact first, then includes for resilience.
  if (op.summary === summary) return true;
  return op.summary.indexOf(summary) !== -1;
}

export function fillPathParams(pathTemplate, params) {
  let result = pathTemplate;
  const keys = Object.keys(params || {});
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const placeholder = '{' + key + '}';
    if (result.indexOf(placeholder) !== -1) {
      result = result.split(placeholder).join(String(params[key]));
    }
  }
  return result;
}

export async function findOperationPath({ tag, method, summary }) {
  const spec = await getSpec();
  const paths = spec.paths || {};
  const pathKeys = Object.keys(paths);
  for (let i = 0; i < pathKeys.length; i += 1) {
    const p = pathKeys[i];
    const item = paths[p] || {};
    const op = item[method];
    if (!op) continue;
    if (tag && !hasTag(op, tag)) continue;
    if (summary && !summaryMatches(op, summary)) continue;
    return { path: p, op };
  }
  throw new Error(`Operation not found in spec: tag="${tag}", method="${method}", summary="${summary}"`);
}

export function isSecuredOperation(op) {
  if (!op) return false;
  if (!op.security) return false;
  return op.security.length > 0;
}

export async function requestBySpec({ method, path, pathParams, query, body, op }) {
  const url = fillPathParams(path, pathParams || {});
  const config = { url, method };

  if (query) config.params = query;
  if (body && method !== 'get' && method !== 'delete') config.data = body;
  if ((method === 'post' || method === 'put' || method === 'patch') && !config.headers) {
    config.headers = { 'Content-Type': 'application/json' };
  }

  // Ensure JWT is present for secured endpoints (in addition to interceptor)
  if (isSecuredOperation(op)) {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return instance.request(config);
}
