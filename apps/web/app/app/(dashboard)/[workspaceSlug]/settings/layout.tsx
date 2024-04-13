import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Nav } from './nav';
import { createAdminClient } from '@saasfy/supabase/server';

export default async function SettingsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { workspaceSlug: string };
}) {
  const supabase = createAdminClient();

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*')
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
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Nav workspace={workspace} />
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </>
  );
}
