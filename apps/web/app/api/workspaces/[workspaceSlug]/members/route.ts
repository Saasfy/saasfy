import { withWorkspaceOwner } from '@saasfy/api/server';
import { createWorkspaceUser } from '@saasfy/crud/workspace-users/server';
import { createAdminClient } from '@saasfy/supabase/server';

export const POST = withWorkspaceOwner(async ({ req, workspace: { id: workspaceId }, user }) => {
  const data = await req.json();

  const supabase = createAdminClient();

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*, plans(*), workspace_users(id)')
    .eq('id', workspaceId)
    .single();

  const maxUsers = workspace?.plans?.max_users || 0;

  if (workspace?.workspace_users?.length ?? 0 >= maxUsers) {
    return Response.json(
      {
        errors: ['Workspace is full'],
        workspace: null,
      },
      {
        status: 400,
      },
    );
  }

  const { errors, workspaceUser } = await createWorkspaceUser({
    ...data,
    workspace_id: workspaceId,
    user_id: user.id,
  });

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
