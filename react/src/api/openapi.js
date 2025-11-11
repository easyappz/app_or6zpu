import yaml from 'js-yaml';

let cachedSpec = null;

export async function getSpec() {
  if (cachedSpec) return cachedSpec;
  const res = await fetch('/openapi.yml', { headers: { 'Accept': 'text/yaml, application/yaml, */*' } });
  if (!res.ok) {
    throw new Error(`Failed to load OpenAPI spec: ${res.status}`);
  }
  const text = await res.text();
  cachedSpec = yaml.load(text);
  return cachedSpec;
}

export async function ensureSpecReady() {
  try {
    await getSpec();
  } catch (e) {
    console.error('OpenAPI spec load error:', e);
  }
}
