import { withUser } from '@saasfy/api/server';
import { createWorkspaceUser } from '@saasfy/crud/workspace-users/server';
import { createWorkspace, deleteWorkspace } from '@saasfy/crud/workspaces/server';

export const POST = withUser(async ({ req, user }) => {
  const data = await req.json();

  const createdWorkspace = await createWorkspace(data);

  if (!createdWorkspace.workspace) {
    return Response.json(
      {
        errors: createdWorkspace.errors ?? ['Failed to create workspace'],
        workspace: null,
      },
      {
        status: 400,
      },
    );
  }

  const createdWorkspaceUser = await createWorkspaceUser({
    user_id: user.id,
    workspace_id: createdWorkspace.workspace.id,
    role: 'owner',
  });

  if (!createdWorkspaceUser.workspaceUser) {
    await deleteWorkspace(createdWorkspace.workspace.id);

    return Response.json(
      {
        errors: createdWorkspaceUser.errors ?? [
          'Failed to create workspace user for new workspace',
        ],
        workspace: createdWorkspace.workspace,
      },
      {
        status: 400,
      },
    );
  }

  return Response.json(
    {
      workspace: {
        ...createdWorkspace.workspace,
        workspace_users: [createdWorkspaceUser.workspaceUser],
      },
      errors: null,
    },
    {
      status: 201,
    },
  );
});
