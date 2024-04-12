import React, { ReactNode, Suspense } from 'react';
import Link from 'next/link';
import { CloudyIcon, SearchIcon, UserCircleIcon } from 'lucide-react';
import { Input } from '@saasfy/ui/input';
import { Button } from '@saasfy/ui/button';
import { createClient } from '@saasfy/supabase/server';
import { AccountMenu, ThemeModeToggle, WorkspaceCombobox } from '@saasfy/components';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();

  const { data: workspaces } = await supabase.from('Workspace').select('*');

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
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
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" placeholder="Search..." type="search" />
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
