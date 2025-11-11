import yaml from 'js-yaml';

let cachedSpec = null;
let loadingPromise = null;

export async function getSpec() {
  if (cachedSpec) return cachedSpec;
  if (loadingPromise) return loadingPromise;
  loadingPromise = fetch('/openapi.yml', { headers: { Accept: 'text/yaml, application/yaml, */*' } })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to load OpenAPI spec: ${res.status}`);
      }
      const text = await res.text();
      const doc = yaml.load(text);
      cachedSpec = doc;
      return cachedSpec;
    })
    .finally(() => {
      loadingPromise = null;
    });
  return loadingPromise;
}

export function getPathFromSpec(path) {
  if (!cachedSpec) return null;
  return cachedSpec.paths?.[path] || null;
}
