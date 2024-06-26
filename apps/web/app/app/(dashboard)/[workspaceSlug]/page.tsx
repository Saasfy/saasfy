import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArrowUpRightIcon, SettingsIcon } from 'lucide-react';

import { CreateProjectSheet } from '@saasfy/components';
import { createAdminClient, getUser } from '@saasfy/supabase/server';
import { Button } from '@saasfy/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@saasfy/ui/table';

export default async function Component({ params }: { params: { workspaceSlug: string } }) {
  const user = await getUser();

  if (!user) {
    return redirect('/login');
  }

  const supabase = createAdminClient();

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*, workspace_users!inner(*)')
    .eq('slug', params.workspaceSlug)
    .eq('workspace_users.user_id', user.id)
    .single();

  if (!workspace) {
    return redirect('/not-found');
  }

  const { data: projects = [] } = (await supabase
    .from('projects')
    .select('*, workspaces(*)')
    .limit(10)
    .eq('workspace_id', workspace.id)) ?? { data: [] };

  return (
    <>
      <div className="flex items-center">
        <div className="flex items-center gap-4">
          <Button size="icon" asChild>
            <Link href={`/${workspace?.slug}/settings`}>
              <SettingsIcon className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          <h1 className="text-lg font-semibold md:text-2xl">{workspace?.name}</h1>
        </div>

        <CreateProjectSheet asChild workspace={workspace}>
          <Button className="ml-auto" size="sm">
            Create Project
          </Button>
        </CreateProjectSheet>
      </div>
      {projects?.length ? (
        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-[150px]">Name</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="w-36">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/${workspace!.slug}/${project.slug}`}>
                        View
                        <ArrowUpRightIcon className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 shadow-sm dark:border-gray-500">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">You have no projects yet.</h3>
            <p className="text-muted-foreground text-sm">
              You can create a project to get started.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
