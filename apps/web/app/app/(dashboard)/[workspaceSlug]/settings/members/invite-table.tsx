import { Tables } from '@saasfy/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@saasfy/ui/table';

import { RemoveInviteButton } from './remove-invite-button';

export function InviteTable({ invites }: { invites: Tables<'workspace_invites'>[] | null }) {
  if (!invites?.length) {
    return <div className="p-6 text-center text-gray-400">No invites found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead className="w-10">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invites.map((invite) => (
          <TableRow key={invite.id}>
            <TableCell>{invite.email}</TableCell>
            <TableCell>{invite.role}</TableCell>
            <TableCell>{invite.expires}</TableCell>
            <TableCell>
              <RemoveInviteButton inviteId={invite.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
