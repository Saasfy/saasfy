import { FilterIcon, PlusIcon } from 'lucide-react';

import { Button } from '@saasfy/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@saasfy/ui/dialog';
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

import { MemberTable } from './member-table';

export default function Component() {
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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Member</DialogTitle>
                <DialogDescription>
                  Enter the email address of the person you want to invite.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Input className="col-span-3" id="email" placeholder="Email" type="email" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Send Invite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <MemberTable />
      </div>
    </div>
  );
}
