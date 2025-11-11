/* OpenAPI spec loader: fetch once on app init and cache */
let cachedSpec = null;
let loadingPromise = null;

const OPENAPI_SPEC_URL = '/openapi.yml';

async function loadSpecOnce() {
  if (cachedSpec) {
    return cachedSpec;
  }
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = fetch(OPENAPI_SPEC_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/yaml, text/yaml, text/plain, */*',
    },
    cache: 'no-store',
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch OpenAPI spec: ${res.status}`);
      }
      const raw = await res.text();

      // Optional: try parse if a YAML parser is available globally (we don't add deps here)
      let parsed = null;
      try {
        if (typeof window !== 'undefined' && window.YAML && typeof window.YAML.parse === 'function') {
          parsed = window.YAML.parse(raw);
        }
      } catch (e) {
        parsed = null;
      }

      cachedSpec = { raw, parsed };
      return cachedSpec;
    })
    .finally(() => {
      // Keep cachedSpec but clear the in-flight promise
      loadingPromise = null;
    });

  return loadingPromise;
}

export async function getSpec() {
  return loadSpecOnce();
}
