'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { Slot } from '@radix-ui/react-slot';

export function DeletePlanButton({ id, children }: { id: string; children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Slot
      onClick={async () => {
        await fetch(`/api/admin/plans/${id}`, {
          method: 'DELETE',
        });

        router.refresh();
      }}
    >
      {children}
    </Slot>
  );
}
