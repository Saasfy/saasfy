import { createAdminClient } from '@saasfy/supabase/server';
import { Button } from '@saasfy/ui/button';

export default async function Component({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();

  const { data: invite, error } = await supabase
    .from('workspace_invites')
    .select('*, workspaces(*)')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error(error);
  }

  if (!invite || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-md p-6 rounded-lg shadow shadow-muted border border-muted">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold">Invite Not Found</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The invite link is invalid or has expired.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md p-6 rounded-lg shadow shadow-muted border border-muted">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold">Join Workspace</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You&apos;ve been invited to collaborate on &quot{invite.workspaces?.name}&quot
            workspace.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button className="px-6 py-3" variant="default">
            Accept
          </Button>
          <Button className="px-6 py-3" variant="outline">
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
