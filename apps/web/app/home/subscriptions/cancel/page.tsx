import Link from 'next/link';

import { CircleX } from 'lucide-react';

import { Button } from '@saasfy/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@saasfy/ui/card';

export default function Component() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-12">
      <Card>
        <CardHeader className={'items-center justify-center'}>
          <CircleX className="text-ged-500 h-16 w-16" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Payment Cancelled
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
              Your payment was cancelled. We hope to see you again soon.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className={'w-full'}>
            <Link href="/">Go back</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
