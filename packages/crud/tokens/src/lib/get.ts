import { createAdminClient } from '@saasfy/supabase/server';

export function getToken(userId: string, id: string) {
  return createAdminClient().from('tokens').select('*').eq('id', id).eq('user', userId).single();
}
