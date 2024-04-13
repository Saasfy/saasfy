import type { User } from '@supabase/supabase-js';
import { withUser } from './with-user';
import { Tables } from '@saasfy/supabase';
import { createAdminClient, createClient } from '@saasfy/supabase/server';

export function withWorkspaceAdmin<T extends { workspaceSlug: string } = { workspaceSlug: string }>(
  handler: (options: {
    req: Request;
    user: User;
    workspace: Tables<'workspaces'>;
    params: T;
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
      .eq('workspace_users.role', 'owner')
      .single();

    if (!workspace) {
      return Response.json(
        { errors: ['You do not have permission to access this source'] },
        { status: 403 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return handler({ req, user, workspace, params: { ...params } });
  });
}
