import { withWorkspaceOwner } from '@saasfy/api/server';
import { createInvite } from '@saasfy/invites/server';

export const POST = withWorkspaceOwner(async ({ req, workspace, user }) => {
  const data = await req.json();

  const { errors, invite } = await createInvite({
    ...data,
    workspace_id: workspace.id,
  });

  return Response.json(
    {
      errors,
      invite,
    },
    {
      status: errors ? 400 : 200,
    },
  );
});
