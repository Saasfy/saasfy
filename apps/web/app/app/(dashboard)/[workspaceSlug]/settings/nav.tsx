'use client';

import Link from 'next/link';
import { type Workspace } from '@prisma/client';
import { ArrowUpRightIcon } from 'lucide-react';
import { Button } from '@saasfy/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@saasfy/utils';

export function Nav({ workspace }: { workspace: Workspace }) {
  const path = usePathname();

  return (
    <>
      <Link
        href={`/${workspace.slug}/settings`}
        className={cn(path === `/${workspace.slug}/settings` ? 'text-foreground' : '')}
      >
        Settings
      </Link>
      <Link
        href={`/${workspace.slug}/settings/members`}
        className={cn(path === `/${workspace.slug}/settings/members` ? 'text-foreground' : '')}
      >
        Members
      </Link>
      <Link
        href={`/${workspace.slug}/settings/notifications`}
        className={cn(path === `/${workspace.slug}/settings/notifications` ? 'text-foreground' : '')}
      >
        Notifications
      </Link>
      {workspace.status === 'active' ? (
        <form action={`/api/workspaces/${workspace.slug}/subscription/portal`} method="GET">
          <button type="submit" className="inline-flex">
            <span>Billing</span>
            <ArrowUpRightIcon size={16} />
          </button>
        </form>
      ) : (
        <Button asChild size="sm" variant="secondary">
          <Link href={`/${workspace.slug}/settings/upgrade`}>Upgrade</Link>
        </Button>
      )}
    </>
  );
}
