'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Tables } from '@saasfy/supabase';
import { Button } from '@saasfy/ui/button';

export function RemoveDomainButton({
  domain,
  workspace,
}: {
  domain: Tables<'domains'>;
  workspace: Tables<'workspaces'>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    const response = await fetch(`/api/workspaces/${workspace.slug}/domains/${domain.slug}`, {
      method: 'DELETE',
    });
    const data = await response.json();

    if (response.ok) {
      router.refresh();
    } else {
      setIsDeleting(false);
      setError(data.errors.join(', '));
    }
  };

  return (
    <div className="flex space-x-3">
      <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Remove'}
      </Button>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}
