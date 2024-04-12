import { NextRequest, NextResponse } from 'next/server';

import { createAuthClient } from '@saasfy/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  requestUrl.host = request.headers.get('host') || 'localhost:3000';

  const auth = createAuthClient();

  await auth.signOut();

  return NextResponse.redirect(`${requestUrl.origin}/signin/signin`);
}
