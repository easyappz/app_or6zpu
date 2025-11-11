import { apiRequest } from '../client';

export async function hello() {
  return apiRequest('utils.hello');
}
