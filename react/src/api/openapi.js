import yaml from 'js-yaml';

let cachedSpec = null;

export async function getSpec() {
  if (cachedSpec) return cachedSpec;
  const res = await fetch('/openapi.yml', { method: 'GET' });
  if (!res.ok) {
    throw new Error('Failed to load OpenAPI spec');
  }
  const text = await res.text();
  const spec = yaml.load(text);
  cachedSpec = spec;
  return spec;
}

export async function ensureSpecReady() {
  return getSpec();
}

function findOperation(spec, matchFn) {
  const paths = spec.paths || {};
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
  for (const pathKey in paths) {
    const item = paths[pathKey] || {};
    for (let i = 0; i < methods.length; i += 1) {
      const m = methods[i];
      const op = item[m];
      if (!op) continue;
      if (matchFn(op, { path: pathKey, method: m })) {
        return { path: pathKey, method: m, op };
      }
    }
  }
  return null;
}

function hasTag(op, tag) {
  if (!op || !op.tags) return false;
  for (let i = 0; i < op.tags.length; i += 1) {
    if (op.tags[i] === tag) return true;
  }
  return false;
}

function bySummaryAndTag(summary, tag) {
  return (op) => hasTag(op, tag) && op.summary === summary;
}

function byPathSuffixAndMethod(suffix, method) {
  // Used only as a fallback when summary text may not be unique.
  return (_op, ctx) => ctx.method === method && ctx.path.endsWith(suffix);
}

export async function resolveOperation(key) {
  const spec = await getSpec();

  const resolvers = {
    'utils.hello': (s) => findOperation(s, bySummaryAndTag('Проверка API', 'Utils')),

    'auth.register': (s) => findOperation(s, bySummaryAndTag('Регистрация нового пользователя', 'Auth')),
    'auth.login': (s) => findOperation(s, bySummaryAndTag('Вход по email и паролю', 'Auth')),

    'members.me.get': (s) => findOperation(s, bySummaryAndTag('Текущий профиль', 'Members')),
    'members.me.put': (s) => findOperation(s, bySummaryAndTag('Обновить профиль', 'Members')),

    'categories.list': (s) => findOperation(s, bySummaryAndTag('Список категорий', 'Categories')),
    'categories.retrieve': (s) => findOperation(s, bySummaryAndTag('Получить категорию', 'Categories')),

    'ads.list': (s) => findOperation(s, bySummaryAndTag('Поиск и список объявлений', 'Ads')),
    'ads.create': (s) => findOperation(s, bySummaryAndTag('Создать объявление', 'Ads')),
    'ads.retrieve': (s) => findOperation(s, bySummaryAndTag('Получить объявление', 'Ads')),
    'ads.update': (s) => findOperation(s, bySummaryAndTag('Обновить объявление', 'Ads')),
    'ads.delete': (s) => findOperation(s, bySummaryAndTag('Удалить объявление', 'Ads')),
    'ads.favorite.add': (s) => findOperation(s, bySummaryAndTag('Добавить в избранное', 'Ads')),
    'ads.favorite.remove': (s) => findOperation(s, bySummaryAndTag('Удалить из избранного', 'Ads')),

    'members.me.ads': (s) => findOperation(s, bySummaryAndTag('Мои объявления', 'Members')),
    'members.me.favorites': (s) => findOperation(s, bySummaryAndTag('Мои избранные объявления', 'Members')),
  };

  const resolver = resolvers[key];
  if (!resolver) {
    throw new Error(`Unknown operation key: ${key}`);
  }
  const resolved = resolver(spec);
  if (!resolved) {
    // Fallbacks for stability if summaries are edited slightly in spec in the future
    if (key === 'utils.hello') return findOperation(spec, byPathSuffixAndMethod('/api/hello/', 'get'));
    if (key === 'members.me.get' || key === 'members.me.put') return findOperation(spec, (_op, ctx) => ctx.path.endsWith('/api/members/me') );
    throw new Error(`Operation not found from spec for key: ${key}`);
  }
  return resolved;
}
