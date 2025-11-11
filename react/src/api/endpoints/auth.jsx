import { apiRequest } from '../client';

export async function registerMember(payload) {
  // payload: { name, email, phone, password }
  return apiRequest('auth.register', { body: {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
  }});
}

export async function loginMember(payload) {
  // payload: { email, password }
  const res = await apiRequest('auth.login', { body: {
    email: payload.email,
    password: payload.password,
  }});
  // Persist JWT for axios interceptor
  if (res && res.access) {
    localStorage.setItem('token', res.access);
  }
  return res;
}

export function logoutMember() {
  localStorage.removeItem('token');
}
