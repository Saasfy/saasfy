import { Button } from '@saasfy/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@saasfy/ui/table';
import { createClient } from '@saasfy/supabase/server';
import React from 'react';
import Link from 'next/link';
import { DeletePlanButton } from './_components/delete-plan-button';

export default async function Component() {
  const supabase = createClient();

  const { data: plans } = await supabase.from('Plan').select('*, Price(*)').eq('Price.status', 'active');

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Plans</h1>
        {plans?.length ? (
          <Button className="ml-auto" size="sm" asChild>
            <Link href="/plans/new">Add Plan</Link>
          </Button>
        ) : null}
      </div>
      {plans?.length ? (
        <div className="border shadow-sm rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-[150px]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.description || 'No description'}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {plan.Price.map((price) => (
                      <div key={price.id}>
                        {price.interval === 'month' ? 'Monthly' : 'Yearly'}: ${price.amount / 100}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{plan.status}</TableCell>
                  <TableCell className="">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/plans/${plan.id}`}>Edit</Link>
                    </Button>
                    <DeletePlanButton id={plan.id}>
                      <Button size="sm" variant="outline" type="button" className={'ml-2'}>
                        Delete
                      </Button>
                    </DeletePlanButton>
                    {/*<form action={`/api/plans/${plan.id}/delete`} method="POST" className="ml-2 inline">*/}
                    {/*  */}
                    {/*</form>*/}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">You have no plans yet.</h3>
            <p className="text-sm text-muted-foreground">You can start selling as soon as you add a plan.</p>
            {/*<CreatePlanSheet asChild>*/}
            <Button className="mt-4" asChild>
              <Link href="/plans/new">Add Plan</Link>
            </Button>
            {/*</CreatePlanSheet>*/}
          </div>
        </div>
      )}
    </main>
  );
}
