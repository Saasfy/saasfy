import { User } from '@supabase/supabase-js';

import { hashToken } from '@saasfy/utils/server';

import { createAdminClient, createAuthClient } from './server-client';

export async function getUser(request?: Request): Promise<User | null> {
  const {
    data: { user },
  } = await createAuthClient({ readonly: true }).getUser();

  if (!user && request) {
    const bearerToken = request?.headers.get('Authorization')?.replace('Bearer ', '');

    if (!bearerToken) {
      return null;
    }

    const hashedToken = hashToken(bearerToken);

    const { data: token } = await createAdminClient()
      .from('tokens')
      .select('*')
      .eq('hashed', hashedToken)
      .single();

    if (!token) {
      return null;
    }

    const { data } = await createAdminClient().auth.admin.getUserById(token.user);

    return data.user;
  }

  return user;
}
