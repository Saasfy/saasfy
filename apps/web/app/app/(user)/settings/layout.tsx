'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@saasfy/utils';

export default function UserSettingsLayout({ children }: { children: ReactNode }) {
  const path = usePathname();

  return (
    <>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">User settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="text-muted-foreground grid gap-4 text-sm">
          <Link
            href={`/settings`}
            className={cn(path === `/settings` ? 'text-primary font-semibold' : '')}
          >
            Profile
          </Link>
          <Link
            href={`/settings/notifications`}
            className={cn(path === `/settings/notifications` ? 'text-primary font-semibold' : '')}
          >
            Notifications
          </Link>
          <Link
            href={`/settings/tokens`}
            className={cn(path === `/settings/tokens` ? 'text-primary font-semibold' : '')}
          >
            API Tokens
          </Link>
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </>
  );
}
