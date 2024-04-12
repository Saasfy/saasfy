import type { User } from '@supabase/supabase-js';
import { withUser } from './with-user';
import { prisma } from '@saasfy/prisma/server';
import { Role, Workspace } from '@prisma/client';

export function withWorkspaceAdmin<T extends { workspaceSlug: string } = { workspaceSlug: string }>(
  handler: (options: { req: Request; user: User; workspace: Workspace; params: T }) => Promise<Response>,
) {
  return withUser<{ workspaceSlug: string }>(async ({ req, user, params }) => {
    if (!params.workspaceSlug) {
      return Response.json({ errors: ['Workspace slug is required'] }, { status: 400 });
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        slug: params.workspaceSlug,
        users: {
          some: {
            userId: user.id,
            role: Role.owner,
          },
        },
      },
    });

    if (!workspace) {
      return Response.json({ errors: ['You do not have permission to access this source'] }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return handler({ req, user, workspace, params: { ...params } });
  });
}
