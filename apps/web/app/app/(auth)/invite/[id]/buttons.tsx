'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@saasfy/ui/button';
import { useToast } from '@saasfy/ui/use-toast';

export function AcceptButton() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Button
      onClick={async function handleClick() {
        const response = await fetch(`/api/invites/${id}/accept`, {
          method: 'POST',
        });

        if (response.ok) {
          router.push('/');

          toast({
            title: 'Success',
            description: 'Invitation accepted.',
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to accept invitation.',
            variant: 'destructive',
          });
        }
      }}
    >
      Accept Invitation
    </Button>
  );
}

export function DeclineButton() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={async function handleClick() {
        const response = await fetch(`/api/invites/${id}/decline`, {
          method: 'POST',
        });

        if (response.ok) {
          router.push('/');

          toast({
            title: 'Success',
            description: 'Invitation declined.',
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to decline invitation.',
            variant: 'destructive',
          });
        }
      }}
    >
      Decline
    </Button>
  );
}
