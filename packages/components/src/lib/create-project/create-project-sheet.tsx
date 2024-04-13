'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@saasfy/ui/sheet';
import { Button } from '@saasfy/ui/button';
import { Input } from '@saasfy/ui/input';
import { createProject } from './actions';
import { ToastAction } from '@saasfy/ui/toast';
import { useToast } from '@saasfy/ui/use-toast';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Tables } from '@saasfy/supabase';

export function CreateProjectSheet({
  children,
  asChild = false,
  className,
  workspace,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  workspace: Tables<'workspaces'> | null | undefined;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  if (!workspace) {
    return null;
  }

  return (
    <Sheet onOpenChange={setSheetIsOpen} open={sheetIsOpen}>
      {children ? (
        <SheetTrigger asChild={asChild} className={className}>
          {children}
        </SheetTrigger>
      ) : null}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>Fill out the form to start a new project.</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <form className="space-y-4">
            <input value={workspace.slug} className="hidden" name="workspaceSlug" />
            <Input placeholder="Project Name" name="name" />
            <Input placeholder="Description" name="description" />
            <Button
              type="submit"
              formAction={async function createProjectFormAction(formData) {
                try {
                  const response = await createProject(formData);

                  if (!response || (response && 'errors' in response)) {
                    toast({
                      title: 'Uh oh! Something went wrong.',
                      description:
                        response?.errors.join('. ') || 'There was a problem with your request.',
                      variant: 'destructive',
                      action: (
                        <ToastAction
                          altText="Try again"
                          onClick={() => createProjectFormAction(formData)}
                        >
                          Try again
                        </ToastAction>
                      ),
                    });
                  } else {
                    toast({
                      title: 'Project created!',
                      description: 'Your project has been created.',
                      action: (
                        <ToastAction
                          altText="View project"
                          onClick={() => {
                            router.push(`/${workspace.slug}/${response.slug}`);
                          }}
                        >
                          View project
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
                        onClick={() => createProjectFormAction(formData)}
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
