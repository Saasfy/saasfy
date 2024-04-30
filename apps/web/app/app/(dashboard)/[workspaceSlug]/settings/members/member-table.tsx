import { TrashIcon } from 'lucide-react';

import { Badge } from '@saasfy/ui/badge';
import { Button } from '@saasfy/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@saasfy/ui/table';

export function MemberTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-10">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>olivia.davis@vercel.com</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>
            <Badge>Active</Badge>
          </TableCell>
          <TableCell>
            <Button variant="ghost">
              <TrashIcon className="w-4 h-4" />
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>michael.johnson@vercel.com</TableCell>
          <TableCell>Member</TableCell>
          <TableCell>
            <Badge variant="destructive">Inactive</Badge>
          </TableCell>
          <TableCell>
            <Button variant="ghost">
              <TrashIcon className="w-4 h-4" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
