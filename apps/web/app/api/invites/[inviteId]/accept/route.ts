import { withUser } from '@saasfy/api/server';
import { createWorkspaceUser } from '@saasfy/crud/workspace-users/server';
import { createAdminClient } from '@saasfy/supabase/server';

export const POST = withUser<{ inviteId: string }>(async ({ req, user, params }) => {
  const supabase = createAdminClient();

  const { data: invite, error } = await supabase
    .from('workspace_invites')
    .select('*, workspaces(*)')
    .eq('id', params.inviteId)
    .eq('email', user.email!)
    .single();

  if (!invite || error) {
    return Response.json(
      {
        errors: ['Invitation not found'],
        invite: null,
      },
      {
        status: 400,
      },
    );
  }

  if (!invite.workspaces) {
    return Response.json(
      {
        errors: ['Invalid invitation'],
        invite: null,
      },
      {
        status: 400,
      },
    );
  }

  const { errors, workspaceUser } = await createWorkspaceUser({
    workspace_id: invite.workspaces.id,
    user_id: user.id,
    role: invite.role,
  });

  await supabase.from('workspace_invites').update({ status: 'accepted' }).eq('id', params.inviteId);

  return Response.json(
    {
      errors,
      workspaceUser,
    },
    {
      status: errors ? 400 : 200,
    },
  );
});
