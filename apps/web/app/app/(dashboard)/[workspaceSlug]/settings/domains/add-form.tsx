'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@saasfy/ui/button';
import { Input } from '@saasfy/ui/input';

export function AddDomainForm() {
  const { workspaceSlug } = useParams();
  const router = useRouter();

  return (
    <form
      className="flex items-center"
      onSubmit={async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);

        const domain = formData.get('domain') as string;

        await fetch(`/api/workspaces/${workspaceSlug}/domains`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: domain,
          }),
        });

        router.refresh();
      }}
    >
      <Input
        placeholder="mywebsite.com"
        name="domain"
        pattern="^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$"
        required
      />
      <Button type="submit" className="ml-4">
        Add
      </Button>
    </form>
  );
}
