import { withWorkspaceOwner } from '@saasfy/api/server';
import { createAdminClient } from '@saasfy/supabase/server';

export const DELETE = withWorkspaceOwner<{ inviteId: string }>(async ({ workspace, params }) => {
  const { inviteId } = params;

  const supabase = createAdminClient();

  await supabase
    .from('workspace_invites')
    .delete()
    .eq('id', inviteId)
    .eq('status', 'pending')
    .eq('workspace_id', workspace.id);

  return Response.json({ success: true });
});
