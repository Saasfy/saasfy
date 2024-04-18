import { createAdminClient } from '@saasfy/supabase/server';

export async function deleteToken(userId: string, id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from('tokens').delete().eq('id', id).eq('user', userId);

  return { errors: error ? [error.message] : null, success: !error };
}
