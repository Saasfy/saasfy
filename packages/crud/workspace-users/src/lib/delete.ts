import { createAdminClient } from '@saasfy/supabase/server';

export async function deleteWorkspaceUser(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('workspace_users')
    .delete()
    .eq('id', id)
    .select('*')
    .single();

  return {
    errors: error ? [error.message] : null,
  };
}
