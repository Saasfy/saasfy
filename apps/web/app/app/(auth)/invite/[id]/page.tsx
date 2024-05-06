import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createAdminClient, getUser } from '@saasfy/supabase/server';
import { Button } from '@saasfy/ui/button';

import { AcceptButton, DeclineButton } from './buttons';

export default async function Component({ params }: { params: { id: string } }) {
  const user = await getUser();

  if (!user) {
    return redirect(`/signin/signin?redirect=${encodeURIComponent(`/invite/${params.id}`)}`);
  }

  const supabase = createAdminClient();

  const { data: invite, error } = await supabase
    .from('workspace_invites')
    .select('*, workspaces(*)')
    .eq('id', params.id)
    .eq('email', user.email!)
    .eq('status', 'pending')
    .single();

  if (error) {
    console.error(error);
  }

  if (!invite || error) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-lg space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Invitation Not Found
              </h1>
              <p className="max-w-[600px] text-gray-500 mx-auto md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                The invitation you are trying to access is not valid or has expired.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-lg space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Welcome to Acme Workspace
            </h1>
            <p className="max-w-[600px] text-gray-500 mx-auto md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              You have been invited to join our workspace.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <AcceptButton />
            <DeclineButton />
          </div>
        </div>
      </div>
    </section>
  );
}
