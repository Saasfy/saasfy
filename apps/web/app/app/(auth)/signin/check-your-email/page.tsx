import Link from 'next/link';

import { Button } from '@saasfy/ui/button';

export default function Component() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md dark:bg-gray-900">
        <h1 className="text-center text-3xl font-bold">Check Your Email</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          We have sent an email with further instructions to reset your password. Please check your
          inbox and follow the instructions.
        </p>
        <Button className="w-full" asChild>
          <Link className="w-full" href="/signin">
            Back to Login
          </Link>
        </Button>
      </div>
    </div>
  );
}
