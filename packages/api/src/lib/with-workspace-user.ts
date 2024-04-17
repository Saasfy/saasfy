import type { User } from '@supabase/supabase-js';
import { withUser } from './with-user';
import { Enums, Tables } from '@saasfy/supabase';
import { createAdminClient } from '@saasfy/supabase/server';

export function withWorkspaceUser<T extends { workspaceSlug: string } = { workspaceSlug: string }>(
  roles: Enums<'Role'>[],
  handler: (options: {
    req: Request;
    user: User;
    workspace: Tables<'workspaces'>;
    params: T;
    role?: Enums<'Role'> | null;
  }) => Promise<Response>,
) {
  return withUser<{ workspaceSlug: string }>(async ({ req, user, params }) => {
    if (!params.workspaceSlug) {
      return Response.json({ errors: ['Workspace slug is required'] }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*, workspace_users(*)')
      .eq('slug', params.workspaceSlug)
      .eq('workspace_users.user_id', user.id)
      .in('workspace_users.role', roles)
      .single();

    if (!workspace) {
      return Response.json(
        { errors: ['You do not have permission to access this source'] },
        { status: 403 },
      );
    }

    return handler({
      req,
      user,
      workspace,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      params: { ...params },
      role: workspace.workspace_users.find((u) => u.user_id === user.id)?.role,
    });
  });
}
