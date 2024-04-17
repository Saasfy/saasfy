import { createAdminClient } from '@saasfy/supabase/server';

export function getWorkspaceUser(params: { userId: string; workspaceId: string }) {
  return createAdminClient()
    .from('workspace_users')
    .select('*')
    .eq('user_id', params.userId)
    .eq('workspace_id', params.workspaceId)
    .single();
}
