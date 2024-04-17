import type { User } from '@supabase/supabase-js';
import { Tables } from '@saasfy/supabase';
import { withWorkspaceUser } from './with-workspace-user';

export function withWorkspaceOwner<T>(
  handler: (options: {
    req: Request;
    user: User;
    workspace: Tables<'workspaces'>;
    params: T & { workspaceSlug: string };
  }) => Promise<Response>,
) {
  return withWorkspaceUser(['owner'], handler);
}
