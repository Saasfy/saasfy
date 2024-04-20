import React, { ReactNode } from 'react';

import { UserCircleIcon } from 'lucide-react';

import { AccountMenu } from '@saasfy/components';
import { Button } from '@saasfy/ui/button';

export default async function Component({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 lg:h-[60px] dark:bg-gray-800/40">
        <div className="w-full flex-1"></div>
        <AccountMenu>
          <Button className="rounded-full" size="icon" variant="secondary">
            <UserCircleIcon className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </AccountMenu>
      </header>

      {children}
    </>
  );
}
