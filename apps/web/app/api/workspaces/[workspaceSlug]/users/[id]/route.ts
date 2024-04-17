import { withWorkspaceOwner } from '@saasfy/api/server';
import { deleteWorkspace } from '@saasfy/workspaces/server';
import { getWorkspaceUser, updateWorkspaceUser } from '@saasfy/workspace-users/server';

export const PATCH = withWorkspaceOwner<{ id: string }>(
  async ({ req, user, workspace, params: { id } }) => {
    const { data: existedWorkspaceUser } = await getWorkspaceUser({
      userId: user.id,
      workspaceId: workspace.id,
    });

    if (!existedWorkspaceUser) {
      return Response.json(
        {
          errors: ['User not found'],
        },
        {
          status: 404,
        },
      );
    }

    if (user.id === existedWorkspaceUser.user_id) {
      return Response.json(
        {
          errors: ['You cannot update your own role'],
        },
        {
          status: 400,
        },
      );
    }

    const data = await req.json();

    const { workspaceUser, errors } = await updateWorkspaceUser(id, {
      ...data,
      workspace_id: workspace.id,
      user_id: user.id,
    });

    return Response.json(
      {
        workspaceUser,
        errors,
      },
      {
        status: errors ? 400 : 200,
      },
    );
  },
);

export const DELETE = withWorkspaceOwner<{ id: string }>(
  async ({ req, params, user, workspace }) => {
    const { data: existedWorkspaceUser } = await getWorkspaceUser({
      userId: user.id,
      workspaceId: workspace.id,
    });

    if (!existedWorkspaceUser) {
      return Response.json(
        {
          errors: ['User not found'],
        },
        {
          status: 404,
        },
      );
    }

    if (user.id === existedWorkspaceUser.user_id) {
      return Response.json(
        {
          errors: ['You cannot update your own role'],
        },
        {
          status: 400,
        },
      );
    }

    const { errors } = await deleteWorkspace(params.id);

    return Response.json(
      {
        errors,
        success: !errors,
      },
      {
        status: errors ? 400 : 200,
      },
    );
  },
);
