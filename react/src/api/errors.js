export function normalizeErrorPayload(payload) {
  // Returns { nonField: string[], fields: Record<string, string[]> }
  const result = { nonField: [], fields: {} };
  if (!payload) return result;

  if (typeof payload === 'string') {
    result.nonField.push(payload);
    return result;
  }

  if (payload.detail && typeof payload.detail === 'string') {
    result.nonField.push(payload.detail);
  }

  // ValidationError shape: { field: ["msg", ...], ... }
  const keys = Object.keys(payload);
  for (const key of keys) {
    const val = payload[key];
    if (key === 'detail') continue;
    if (key === 'non_field_errors' && Array.isArray(val)) {
      result.nonField.push(...val.filter(Boolean).map(String));
      continue;
    }
    if (Array.isArray(val)) {
      result.fields[key] = val.filter(Boolean).map(String);
    }
  }
  return result;
}

export function extractAxiosErrors(error) {
  const status = error?.response?.status;
  const data = error?.response?.data;
  return { status, ...normalizeErrorPayload(data) };
}
