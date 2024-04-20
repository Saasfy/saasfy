import type { User } from '@supabase/supabase-js';

import { withUser } from './with-user';

export function withPlatformAdmin<T>(
  handler: (options: { req: Request; user: User; params: T }) => Promise<Response>,
) {
  return withUser<T>(async ({ user, ...options }) => {
    if (!user || user.email !== process.env.SAASFY_ADMIN_EMAIL) {
      return Response.json(
        {
          errors: ['You do not have permission to perform this action'],
        },
        {
          status: 403,
        },
      );
    }

    return handler({ user, ...options });
  });
}
