import { withWorkspaceOwner, withWorkspaceUser } from '@saasfy/api/server';
import { deleteWorkspace, updateWorkspace } from '@saasfy/workspaces/server';

export const PATCH = withWorkspaceUser(
  ['member', 'owner'],
  async ({ req, workspace: { id }, role }) => {
    const data = await req.json();

    const { workspace, errors } = await updateWorkspace(id, data);

    return Response.json(
      {
        workspace,
        errors,
      },
      {
        status: errors ? 400 : 200,
      },
    );
  },
);

export const DELETE = withWorkspaceOwner(async ({ req, workspace: { id } }) => {
  const { errors } = await deleteWorkspace(id);

  return Response.json(
    {
      errors,
      success: !errors,
    },
    {
      status: errors ? 400 : 200,
    },
  );
});
