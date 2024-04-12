import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';
import { Button } from '@saasfy/ui/button';
import { createClient, getUser } from '@saasfy/supabase/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@saasfy/ui/table';
import { Badge } from '@saasfy/ui/badge';
import { CreateWorkspaceSheet } from '@saasfy/components';
import { redirect } from 'next/navigation';

export default async function Component() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  const supabase = createClient();
  const { data: workspaces } = await supabase
    .from('Workspace')
    .select('*, Project(id), Domain(id), WorkspaceUser(id), Plan(name)')
    .limit(8);

  return (
    <>
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Workspaces</h1>

        <CreateWorkspaceSheet asChild>
          <Button className="ml-auto" size="sm">
            Create Workspace
          </Button>
        </CreateWorkspaceSheet>
      </div>
      {workspaces?.length ? (
        <div className="border shadow-sm rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-[150px]">Name</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="hidden md:table-cell">Projects</TableHead>
                <TableHead>Domains</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces?.map((workspace) => (
                <TableRow key={workspace.id}>
                  <TableCell className="font-medium">{workspace.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge className="capitalize" variant={workspace.status === 'active' ? 'default' : 'destructive'}>
                      {workspace.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{workspace.Plan?.name}</TableCell>
                  <TableCell>{workspace.Project?.length}</TableCell>
                  <TableCell className="hidden md:table-cell">{workspace.Domain?.length}</TableCell>
                  <TableCell className="w-36">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/${workspace.slug}`}>
                        View
                        <ArrowUpRightIcon className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-lg">No workspaces have been created yet.</p>
        </div>
      )}
    </>
  );
}
