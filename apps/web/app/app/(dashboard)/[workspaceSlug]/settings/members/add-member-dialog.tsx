'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';

import { Button } from '@saasfy/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@saasfy/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@saasfy/ui/form';
import { Input } from '@saasfy/ui/input';
import { Label } from '@saasfy/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@saasfy/ui/select';
import { useToast } from '@saasfy/ui/use-toast';

export function AddMemberDialog({ children }: { children: React.ReactNode }) {
  const params = useParams();

  const form = useForm({
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to invite.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-4 py-4"
            id="add-member-form"
            onSubmit={form.handleSubmit(async (data) => {
              const response = await fetch(`/api/workspaces/${params.workspaceSlug}/invites`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              const { invite, errors } = await response.json();

              if (errors) {
                toast({
                  title: 'Error',
                  description: errors.join(', '),
                  variant: 'destructive',
                });
                setDialogOpen(false);
                return;
              }

              toast({
                title: 'Success',
                description: `Invitation sent to ${invite.email}`,
              });

              navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.id}`);

              router.refresh();
              setDialogOpen(false);
            })}
          >
            <FormField
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right" htmlFor="email">
                      Email
                    </Label>
                    <FormControl>
                      <Input className="col-span-3" placeholder="Email" type="email" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
              name="email"
            />
            <FormField
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="role">
                    Role
                  </Label>
                  <Select
                    {...field}
                    onValueChange={(value) => {
                      field.onChange({ target: { value } });
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              )}
              name="role"
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-member-form">
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
