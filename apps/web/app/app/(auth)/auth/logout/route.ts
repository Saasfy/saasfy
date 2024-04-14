import { createAuthClient } from '@saasfy/supabase/server';
import { getUrl } from '@saasfy/api/server';

export async function GET(request: Request) {
  const auth = createAuthClient();

  await auth.signOut();

  return Response.redirect(getUrl(request, '/signin/signin'));
}
