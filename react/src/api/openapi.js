import yaml from 'js-yaml';

let specPromise = null;

export function getSpec() {
  if (!specPromise) {
    specPromise = fetch('/openapi.yml', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load OpenAPI spec: ${res.status}`);
        return res.text();
      })
      .then((text) => yaml.load(text));
  }
  return specPromise;
}

export async function ensurePath(method, path) {
  const spec = await getSpec();
  const entry = spec?.paths?.[path]?.[method.toLowerCase()];
  if (!entry) {
    // Not throwing to avoid blocking UI in dev, but warn loudly
    console.warn(`Path ${method.toUpperCase()} ${path} not found in OpenAPI spec`);
  }
  return spec;
}
