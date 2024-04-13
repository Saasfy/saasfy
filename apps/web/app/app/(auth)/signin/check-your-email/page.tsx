import { Button } from '@saasfy/ui/button';
import Link from 'next/link';

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-center">Check Your Email</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center">
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
