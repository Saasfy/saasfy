import { NextRequest, NextResponse } from 'next/server';

import { createAuthClient } from '@saasfy/supabase/server';
import { getErrorRedirect, getStatusRedirect } from '@saasfy/utils/server';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  requestUrl.host = request.headers.get('host') || 'localhost:3000';

  if (code) {
    const auth = createAuthClient();

    const { error } = await auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again.",
        ),
      );
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(`${requestUrl.origin}/`, 'Success!', 'You are now signed in.'),
  );
}
