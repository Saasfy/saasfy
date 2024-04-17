import { createAdminClient } from '@saasfy/supabase/server';

export async function deleteWorkspace(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from('workspaces').delete().eq('id', id).select('*').single();

  return {
    errors: error ? [error.message] : null,
  };
}
