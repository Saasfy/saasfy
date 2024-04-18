import { withWorkspaceOwner } from '@saasfy/api/server';
import { createWorkspaceUser } from '@saasfy/crud/workspace-users/server';

export const POST = withWorkspaceOwner(async ({ req, workspace, user }) => {
  const data = await req.json();

  const { errors, workspaceUser } = await createWorkspaceUser({
    ...data,
    workspace_id: workspace.id,
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
