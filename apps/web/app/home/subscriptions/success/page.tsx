import { CheckIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@saasfy/ui/card';
import Link from 'next/link';
import { Button } from '@saasfy/ui/button';
import { headers } from 'next/headers';

export default function Component() {
  const host = headers().get('host');

  const appUrl = `${host && host.includes('localhost') ? 'http' : 'https'}://app.${host}`;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12">
      <Card>
        <CardHeader className={'justify-center items-center'}>
          <CheckIcon className="w-16 h-16 text-green-500" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-gray-100">Payment Successful!</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
              Thank you for your purchase. Your subscription is now active.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className={'w-full'}>
            <Link href={appUrl}>Go to the app</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
