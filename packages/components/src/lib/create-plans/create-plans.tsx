'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@saasfy/ui/form';
import { Button } from '@saasfy/ui/button';
import Link from 'next/link';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@saasfy/ui/card';
import { Input } from '@saasfy/ui/input';
import { Textarea } from '@saasfy/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@saasfy/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@saasfy/ui/toggle-group';
import { Switch } from '@saasfy/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@saasfy/ui/select';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { createPlan, updatePlan } from './actions';
import { useToast } from '@saasfy/ui/use-toast';
import { useRouter } from 'next/navigation';

export type CreatePlanFormValues = {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  max_users: number;
  max_projects: number;
  max_domains: number;
  features: Array<{
    name: string;
  }>;
  prices: Array<{
    amount: number;
    interval: string;
    status: 'active' | 'inactive';
  }>;
};

export function CreatePlanForm({
  defaultValues,
  id,
}: {
  defaultValues?: CreatePlanFormValues;
  id?: string;
}) {
  const form = useForm<CreatePlanFormValues>({
    defaultValues: defaultValues ?? {
      description: '',
      status: 'active',
      max_users: 1,
      max_projects: 0,
      max_domains: 0,
      name: '',
      prices: [],
      features: [],
    },
  });

  const { fields: prices, append: appendPrice } = useFieldArray({
    control: form.control,
    name: 'prices',
  });

  const {
    fields: features,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control: form.control,
    name: 'features',
  });

  const { toast } = useToast();

  const router = useRouter();

  async function onSubmitWithCreating(form: any) {
    const { data, errors } = await createPlan(form);

    if (errors) {
      toast({
        title: 'Error',
        description: errors.join(', '),
      });

      return;
    }

    toast({
      title: 'Success',
      description: 'Plan created successfully',
    });

    router.push(`/plans`);
  }

  async function onSubmitWithUpdating(form: any) {
    const { data, errors } = (await updatePlan(id!, form)) ?? {};

    if (errors) {
      toast({
        title: 'Error',
        description: errors.join(', '),
      });

      return;
    }

    toast({
      title: 'Success',
      description: 'Plan updated successfully',
    });

    router.push(`/plans/${data!.id}`);
  }

  async function onSubmit(form: any) {
    if (defaultValues) {
      await onSubmitWithUpdating(form);
    } else {
      await onSubmitWithCreating(form);
    }
  }

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 mb-12">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                  <Link href="/plans">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  {defaultValues ? 'Edit Plan' : 'Create Plan'}
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button size="sm" type="submit">
                    Save Plan
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Plan Details</CardTitle>
                      <CardDescription>
                        Please provide the following details to create a new plan.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <FormControl>
                                  <Input {...field} className="w-full" required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                            name="name"
                          />
                        </div>
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="description">Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} className="w-full" required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                            name="description"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Feature</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {features.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`features.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} required />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  type="button"
                                  onClick={() => removeFeature(index)}
                                  className="gap-1"
                                >
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="justify-center border-t p-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1"
                        type="button"
                        onClick={() => appendFeature({ name: '' })}
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        Add Feature
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card x-chunk="dashboard-07-chunk-1">
                    <CardHeader>
                      <CardTitle>Prices</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Price</TableHead>
                            <TableHead className="w-[100px]">Interval</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prices.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`prices.${index}.amount`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="sr-only">Price</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          {...field}
                                          required
                                          min={0}
                                          step="0.01"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`prices.${index}.interval`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <ToggleGroup
                                          type="single"
                                          {...field}
                                          onValueChange={(value) => {
                                            field.onChange({ target: { value } });
                                          }}
                                        >
                                          <ToggleGroupItem value="month">Monthly</ToggleGroupItem>
                                          <ToggleGroupItem value="year">Yearly</ToggleGroupItem>
                                        </ToggleGroup>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`prices.${index}.status`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Switch
                                          {...field}
                                          value=""
                                          checked={field.value === 'active'}
                                          defaultChecked={field.value === 'active'}
                                          onCheckedChange={(checked) => {
                                            field.onChange({
                                              target: { value: checked ? 'active' : 'inactive' },
                                            });
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="justify-center border-t p-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1"
                        type="button"
                        onClick={() =>
                          appendPrice({
                            amount: 0,
                            interval: 'month',
                            status: 'active',
                          })
                        }
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        Add Price
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-3">
                    <CardHeader>
                      <CardTitle>Product Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                  <Select
                                    {...field}
                                    onValueChange={(value) => {
                                      field.onChange({ target: { value } });
                                    }}
                                    value={field.value}
                                  >
                                    <SelectTrigger aria-label="Select status">
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card x-chunk="dashboard-07-chunk-5">
                    <CardHeader>
                      <CardTitle>Parameters</CardTitle>
                      <CardDescription>
                        Define the parameters for the plan. These parameters will be used to limit
                        the usage of the plan.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="max_users"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Users</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" required min={1} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="max_projects"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Projects</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" required min={0} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="max_domains"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Domains</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" required min={0} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:hidden">
                <Button className="w-full" size="sm" type="submit">
                  Save Product
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
