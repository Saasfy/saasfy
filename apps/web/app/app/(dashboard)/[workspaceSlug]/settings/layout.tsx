import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';
import { prisma } from '@saasfy/prisma/server';
import { WorkspaceStatus } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Button } from '@saasfy/ui/button';
import { Nav } from './nav';

export default async function SettingsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { workspaceSlug: string };
}) {
  const workspace = await prisma.workspace.findUnique({
    where: {
      slug: params.workspaceSlug,
    },
    include: {
      plan: {
        include: {
          prices: true,
        },
      },
    },
  });

  if (!workspace) {
    return redirect('/not-found');
  }

  return (
    <>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Workspace settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Nav workspace={workspace} />
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </>
  );
}
