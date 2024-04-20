'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@saasfy/ui/button';
import { Input } from '@saasfy/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@saasfy/ui/sheet';
import { ToastAction } from '@saasfy/ui/toast';
import { useToast } from '@saasfy/ui/use-toast';

import { createWorkspace } from './actions';

export function CreateWorkspaceSheet({
  children,
  asChild = false,
  className,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  return (
    <Sheet onOpenChange={setSheetIsOpen} open={sheetIsOpen}>
      {children ? (
        <SheetTrigger asChild={asChild} className={className}>
          {children}
        </SheetTrigger>
      ) : null}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Workspace</SheetTitle>
          <SheetDescription>Fill out the form to start a new workspace.</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <form className="space-y-4">
            <Input placeholder="Worspace Name" name="name" />
            <Input placeholder="Description" name="description" />
            <Button
              type="submit"
              formAction={async function createWorkspaceFormAction(formData) {
                try {
                  const response = await createWorkspace(formData);

                  if (!response || (response && 'errors' in response)) {
                    toast({
                      title: 'Uh oh! Something went wrong.',
                      description: response
                        ? response.errors.join('. ')
                        : 'There was a problem with your request.',
                      variant: 'destructive',
                      action: (
                        <ToastAction
                          altText="Try again"
                          onClick={() => createWorkspaceFormAction(formData)}
                        >
                          Try again
                        </ToastAction>
                      ),
                    });
                  } else {
                    toast({
                      title: 'Workspace created!',
                      description: 'Your workspace has been created.',
                      action: (
                        <ToastAction
                          altText="View workspace"
                          onClick={() => {
                            router.push(`/${response.slug}`);
                          }}
                        >
                          View workspace
                        </ToastAction>
                      ),
                    });
                  }
                } catch (error) {
                  toast({
                    title: 'Uh oh! Something went wrong.',
                    description: 'There was a problem with your request.',
                    action: (
                      <ToastAction
                        altText="Try again"
                        onClick={() => createWorkspaceFormAction(formData)}
                      >
                        Try again
                      </ToastAction>
                    ),
                  });
                } finally {
                  setSheetIsOpen(false);
                }
              }}
            >
              Create
            </Button>
            <SheetClose asChild className="ml-2">
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
