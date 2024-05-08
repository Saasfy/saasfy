'use client';

import { useParams, useRouter } from 'next/navigation';

import { TrashIcon } from 'lucide-react';

import { Button } from '@saasfy/ui/button';

export function RemoveInviteButton({ inviteId }: { inviteId: string }) {
  const { workspaceSlug } = useParams();
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await fetch(`/api/workspaces/${workspaceSlug}/invites/${inviteId}`, {
          method: 'DELETE',
        });

        router.refresh();
      }}
      variant="destructive"
      size="icon"
    >
      <TrashIcon className="w-4 h-4" />
    </Button>
  );
}
