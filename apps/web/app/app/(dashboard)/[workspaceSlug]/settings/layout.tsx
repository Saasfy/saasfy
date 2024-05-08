import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { createAdminClient, getUser } from '@saasfy/supabase/server';

import { Nav } from './nav';

export default async function SettingsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { workspaceSlug: string };
}) {
  const user = await getUser();

  if (!user) {
    return redirect(`/signin/signin`);
  }

  const supabase = createAdminClient();

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*, workspace_users!inner(*)')
    .eq('workspace_users.user_id', user.id)
    .eq('slug', params.workspaceSlug)
    .single();

  if (!workspace) {
    return redirect('/not-found');
  }

  return (
    <>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Workspace settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="text-muted-foreground grid gap-4 text-sm">
          <Nav workspace={workspace} />
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </>
  );
}
