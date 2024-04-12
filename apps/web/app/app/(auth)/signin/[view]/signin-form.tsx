'use client';

import { useToast } from '@saasfy/ui/use-toast';
import { createClient } from '@saasfy/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@saasfy/ui/card';
import { Button } from '@saasfy/ui/button';
import { forgotPassword, login, signup } from './signin-actions';
import Link from 'next/link';
import { Label } from '@saasfy/ui/label';
import { Input } from '@saasfy/ui/input';

export type SignInViews = 'signin' | 'signup' | 'forgot-password';

export function SignInForm({ view }: { view: SignInViews }) {
  const { toast } = useToast();

  const supabase = createClient();

  return (
    <form>
      <Card className="sm:min-w-[30rem] min-w-full">
        <CardHeader>
          <CardTitle className="text-2xl">
            {
              {
                signin: 'Login',
                signup: 'Sign Up',
                'forgot-password': 'Reset Password',
              }[view]
            }
          </CardTitle>
          <CardDescription>
            {
              {
                signin: 'Enter your email below to login to your account.',
                signup: 'Enter your email below to create an account.',
                'forgot-password': 'Enter your email below to reset your password.',
              }[view]
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {
            {
              signin: <SignInView />,
              signup: <SignUpView />,
              'forgot-password': <ForgotPasswordView />,
            }[view]
          }
          <Button
            className="w-full"
            formAction={async (formData) => {
              const { errors } =
                (await {
                  signin: login,
                  signup: signup,
                  'forgot-password': forgotPassword,
                }[view](formData)) ?? {};

              if (errors) {
                toast({
                  title: 'Error',
                  description: errors.join('\n'),
                  variant: 'destructive',
                });
              }
            }}
          >
            {
              {
                signin: 'Sign in',
                signup: 'Sign up',
                'forgot-password': 'Reset password',
              }[view]
            }
          </Button>

          {view === 'signin' || view === 'signup' ? (
            <>
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300" />
                <span className="mx-4 flex-shrink text-sm text-gray-600">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-gray-300" />
              </div>

              <div className="flex gap-2">
                <Button
                  className="w-full"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    supabase.auth.signInWithOAuth({
                      provider: 'google',
                    });
                  }}
                >
                  <GoogleIcon className="w-6 h-6 mr-2" />
                  Google
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    supabase.auth.signInWithOAuth({
                      provider: 'github',
                      options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                      },
                    });
                  }}
                >
                  <GithubIcon className="w-6 h-6 mr-2" />
                  Github
                </Button>
              </div>
            </>
          ) : null}

          <div className="flex flex-col justify-center items-center">
            {
              {
                signin: (
                  <>
                    <Button variant="link" asChild>
                      <Link href="/signin/forgot-password" className="text-sm text-blue-500">
                        Forgot password?
                      </Link>
                    </Button>
                    <Button variant="link" asChild>
                      <Link href="/signin/signup" className="text-sm text-blue-500">
                        Sign up
                      </Link>
                    </Button>
                  </>
                ),
                signup: (
                  <Button variant="link" asChild>
                    <Link href="/signin/signin" className="text-sm text-blue-500">
                      Sign in
                    </Link>
                  </Button>
                ),
                'forgot-password': (
                  <Button variant="link" asChild>
                    <Link href="/signin/signin" className="text-sm text-blue-500">
                      Sign in
                    </Link>
                  </Button>
                ),
              }[view]
            }
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

function SignInView() {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" type="email" placeholder="m@example.com" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" required />
      </div>
    </>
  );
}

function SignUpView() {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" type="email" placeholder="m@example.com" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" required min="8" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input name="confirm-password" type="password" required min="8" />
      </div>
    </>
  );
}

function ForgotPasswordView() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input name="email" type="email" placeholder="m@example.com" required />
    </div>
  );
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 210 210">
      <path
        d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40
	c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105
	S0,162.897,0,105z"
      />
    </svg>
  );
}

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg fill="currentColor" className={className} viewBox="0 0 97.707 97.707">
      <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
    </svg>
  );
}
