'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@saasfy/utils';

export default function UserSettingsLayout({ children }: { children: ReactNode }) {
  const path = usePathname();

  return (
    <>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">User settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link
            href={`/settings`}
            className={cn(path === `/settings` ? 'font-semibold text-primary' : '')}
          >
            Profile
          </Link>
          <Link
            href={`/settings/notifications`}
            className={cn(path === `/settings/notifications` ? 'font-semibold text-primary' : '')}
          >
            Notifications
          </Link>
          <Link
            href={`/settings/tokens`}
            className={cn(path === `/settings/tokens` ? 'font-semibold text-primary' : '')}
          >
            API Tokens
          </Link>
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </>
  );
}
