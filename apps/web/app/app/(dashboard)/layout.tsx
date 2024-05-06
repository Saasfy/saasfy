import React, { ReactNode, Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { CloudyIcon, SearchIcon, UserCircleIcon } from 'lucide-react';

import { AccountMenu, ThemeModeToggle, WorkspaceCombobox } from '@saasfy/components';
import { createAdminClient, getUser } from '@saasfy/supabase/server';
import { Button } from '@saasfy/ui/button';
import { Input } from '@saasfy/ui/input';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getUser();

  if (!user) {
    return redirect(`/signin/signin`);
  }

  const supabase = createAdminClient();

  const { data: workspaces } = await supabase.from('workspaces').select('*').eq('user_id', user.id);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      <div className="flex min-h-screen w-full flex-col">
        <header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-4 md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" href={`/`}>
              <CloudyIcon className="h-6 w-6" />
              <span className="sr-only">Saasfy</span>
            </Link>
            <WorkspaceCombobox workspaces={workspaces} />
          </nav>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <SearchIcon className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
                <Input
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                  placeholder="Search..."
                  type="search"
                />
              </div>
            </form>
            <AccountMenu>
              <Button className="rounded-full" size="icon" variant="secondary">
                <UserCircleIcon className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </AccountMenu>
            <ThemeModeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
      </div>
    </div>
  );
}
