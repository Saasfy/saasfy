import { createAuthClient } from './server-client';

export async function getUser() {
  const { data } = await createAuthClient({ readonly: true }).getUser();

  return data.user;
}
