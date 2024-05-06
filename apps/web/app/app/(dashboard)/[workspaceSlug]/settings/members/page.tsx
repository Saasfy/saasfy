import React from 'react';
import { redirect } from 'next/navigation';

import { FilterIcon, PlusIcon } from 'lucide-react';
import postgres from 'postgres';

import { createAdminClient, Tables } from '@saasfy/supabase/server';
import { Button } from '@saasfy/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@saasfy/ui/dropdown-menu';
import { Input } from '@saasfy/ui/input';

import { AddMemberDialog } from './add-member-dialog';
import { InviteTable } from './invite-table';
import { MemberTable } from './member-table';

export default async function Component({ params }: { params: { workspaceSlug: string } }) {
  const supabase = createAdminClient();

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*')
    .eq('slug', params.workspaceSlug)
    .single();

  if (!workspace) {
    return redirect('/not-found');
  }

  const sql = postgres(process.env.POSTGRES_URL!);

  const workspaceMembers = await sql<(Tables<'workspace_users'> & { email: string })[]>`
    SELECT workspace_users.*, users.email
    FROM public.workspace_users
           JOIN auth.users on public.workspace_users.user_id = auth.users.id
    WHERE public.workspace_users.workspace_id = ${workspace.id}
  `;

  const { data: invites } = await supabase
    .from('workspace_invites')
    .select('*')
    .eq('status', 'pending')
    .eq('workspace_id', workspace.id);

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Workspace Members</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage members of your workspace.</p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-2">
          <Input className="max-w-xs" placeholder="Search members..." type="search" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Role</DropdownMenuLabel>
              <DropdownMenuRadioGroup value="all">
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuRadioGroup value="all">
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="inactive">Inactive</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <AddMemberDialog>
            <Button size="sm" type="button">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </AddMemberDialog>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <MemberTable members={workspaceMembers} />
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Invitations</h2>
        <div className="border rounded-lg overflow-hidden">
          <InviteTable invites={invites} />
        </div>
      </div>
    </div>
  );
}
