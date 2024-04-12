'use client';

import { Tables } from '@saasfy/supabase';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@saasfy/ui/popover';
import { Button } from '@saasfy/ui/button';
import { Check, ChevronsUpDown, PlusIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@saasfy/ui/command';
import { cn } from '@saasfy/utils';
import { CreateWorkspaceSheet } from '../create-workspace/create-workspace-sheet';

export function WorkspaceCombobox({ workspaces = [] }: { workspaces?: Tables<'Workspace'>[] | null }) {
  const { workspaceSlug: slug } = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {slug ? workspaces?.find((workspace) => workspace.slug === slug)?.name : 'Select workspace...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search workspace..." />
          <CommandList>
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup>
              {workspaces?.map((workspace) => (
                <CommandItem
                  key={workspace.slug}
                  value={workspace.slug}
                  onSelect={(currentValue) => {
                    router.push(`/${currentValue}`);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', slug === workspace.slug ? 'opacity-100' : 'opacity-0')} />
                  {workspace.name}
                </CommandItem>
              ))}

              <CommandSeparator className="my-1" />

              <CreateWorkspaceSheet className="w-full">
                <CommandItem>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create new workspace
                </CommandItem>
              </CreateWorkspaceSheet>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
