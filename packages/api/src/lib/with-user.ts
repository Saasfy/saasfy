import type { User } from '@supabase/supabase-js';
import { getUser } from '@saasfy/supabase/server';

export function withUser<T>(handler: (options: { req: Request; user: User; params: T }) => Promise<Response>) {
  return async (req: Request, options: { params: T }) => {
    const user = await getUser();

    if (!user) {
      return Response.json({ errors: ['You have to be logged in to access this source'] }, { status: 401 });
    }

    return handler({ req, user, ...options });
  };
}
