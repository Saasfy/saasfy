import { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { CloudyIcon } from 'lucide-react';

import { getUser } from '@saasfy/supabase/server';

import DashboardNav from './nav';

export default async function Component({ children }: { children: ReactNode }) {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  if (user.email !== process.env.SAASFY_ADMIN_EMAIL) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-semibold">You are not authorized to access this page.</h1>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <CloudyIcon className="h-6 w-6" />
              <span className="">Saasfy</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <DashboardNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
