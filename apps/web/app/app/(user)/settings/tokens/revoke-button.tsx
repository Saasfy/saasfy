'use client';

import { useRouter } from 'next/navigation';

import { Slot } from '@radix-ui/react-slot';

export function RevokeButton({ id, children }: { id: string; children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Slot
      onClick={async () => {
        await fetch(`/api/tokens/${id}`, {
          method: 'DELETE',
        });

        router.refresh();
      }}
    >
      {children}
    </Slot>
  );
}
