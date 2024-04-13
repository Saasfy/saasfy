import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from './db-types';
import { NextResponse } from 'next/server';

// Define a function to create a Supabase client for server-side operations
// The function takes a cookie store created with next/headers cookies as an argument
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    // Pass Supabase URL and anonymous key from the environment to the client
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    // Define a cookies object with methods for interacting with the cookie store and pass it to the client
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
}

export function createAuthClient({
  response,
  readonly = false,
}: { response?: NextResponse; readonly?: boolean } = {}) {
  const cookieStore = cookies();

  return createServerClient<Database>(
    // Pass Supabase URL and anonymous key from the environment to the client
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    // Define a cookies object with methods for interacting with the cookie store and pass it to the client
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          if (readonly) {
            return;
          }

          cookieStore.set({ name, value, ...options });
          response?.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          if (readonly) {
            return;
          }

          cookieStore.delete({ name, ...options });
          response?.cookies.delete({ name, ...options });
        },
      },
    },
  ).auth;
}

export function createAdminClient() {
  return createServerClient<Database>(
    // Pass Supabase URL and anonymous key from the environment to the client
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {},
    },
  );
}

export function createAuthAdminClient() {
  return createAdminClient().auth.admin;
}
