import { getUrl } from '@saasfy/api/server';
import { createAuthClient } from '@saasfy/supabase/server';

export async function GET(request: Request) {
  const auth = createAuthClient();

  await auth.signOut();

  return Response.redirect(getUrl(request, '/signin/signin'));
}
