import Link from 'next/link';

import { Button } from '@saasfy/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@saasfy/ui/card';
import { Input } from '@saasfy/ui/input';
import { Label } from '@saasfy/ui/label';

import { GithubIcon, GoogleIcon } from '../../app/(auth)/signin/[view]/signin-form';

export function SignInMock() {
  return (
    <div className="flex min-h-[720px] items-center justify-center">
      <form>
        <Card className="min-w-full sm:min-w-[30rem]">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your email below to login to your account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" type="password" required />
            </div>
            <Button className="w-full" type="submit">
              Sign in
            </Button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-4 flex-shrink text-sm text-gray-600">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            <div className="flex gap-2">
              <Button className="w-full" variant="outline" type="button">
                <GoogleIcon className="mr-2 h-6 w-6" />
                Google
              </Button>

              <Button className="w-full" variant="outline" type="button">
                <GithubIcon className="mr-2 h-6 w-6" />
                Github
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Button variant="link" asChild>
                <Link className="text-sm text-blue-500" href="#">
                  Forgot password?
                </Link>
              </Button>
              <Button variant="link" asChild>
                <Link href="#" className="text-sm text-blue-500">
                  Sign up
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
