import { NextResponse, type NextRequest } from 'next/server';

import { updateSession } from '@saasfy/supabase/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  const hostname = request.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  const searchParams = request.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // rewrites for app pages
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return updateSession(request, `/app${path === '/' ? '' : path}`);
  }

  if (hostname == `admin.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return updateSession(request, `/admin${path === '/' ? '' : path}`);
  }

  // rewrite root application to `/home` folder
  if (hostname === 'localhost:3000' || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    return NextResponse.rewrite(new URL(`/home${path === '/' ? '' : path}`, request.url));
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_static/|_vercel|_next/image|favicon.ico|robots.txt|opengraph-image|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
