'use server';

import { PriceInterval, PrismaClient } from '@prisma/client';
import { createClient } from '@saasfy/supabase/server';
import { revalidatePath } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { z, ZodError } from 'zod';
import { stripe } from '@saasfy/stripe/server';
import slugify from 'slugify';
import { prisma } from '@saasfy/prisma/server';

const CreatePlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  status: z.enum(['active', 'inactive'], {
    description: 'Status must be either active or inactive',
  }),
  maxUsers: z.coerce.number().min(1, 'Max users must be greater than 0').int('Max users must be a whole number'),
  maxProjects: z.coerce
    .number()
    .nonnegative('Max projects must be greater than or equal to 0')
    .int('Max projects must be a whole number'),
  maxDomains: z.coerce
    .number()
    .nonnegative('Max domains must be greater than or equal to 0')
    .int('Max domains must be a whole number'),
  features: z.array(
    z.object({
      name: z.string().min(1, 'Feature name is required'),
    }),
  ),
  prices: z.array(
    z.object({
      interval: z.enum([PriceInterval.month, PriceInterval.year]),
      status: z.enum(['active', 'inactive']),
      amount: z.coerce
        .number()
        .min(0, 'Amount must be greater than or equal to 0')
        .transform((value) => Math.round(value * 100)),
    }),
  ),
});

function isPrismaError(error: any): error is PrismaClientKnownRequestError {
  return error.code === 'P2002';
}

export async function createPlan(formData: z.infer<typeof CreatePlanSchema>) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error('You have to be logged in to create a project');
  }

  if (user.email !== process.env.SAASFY_ADMIN_EMAIL) {
    throw new Error('You have to be an admin to create a project');
  }

  try {
    formData = CreatePlanSchema.parse(formData);
  } catch (error) {
    return {
      errors: (error as ZodError).errors.map((err) => err.message),
    };
  }

  try {
    const product = await stripe.products.create({
      name: formData.name,
    });

    const prices = await Promise.all(
      formData.prices.map((price) =>
        stripe.prices.create({
          currency: 'usd',
          unit_amount: price.amount,
          recurring: {
            interval: price.interval,
          },
          product: product.id,
        }),
      ),
    );

    const plan = await prisma.plan.create({
      data: {
        ...formData,
        slug: slugify(formData.name, { lower: true }),
        stripeProductId: product.id,
        features: formData.features.map((feature) => feature.name),
        prices: {
          create: prices.map((price, index) => ({
            stripePriceId: price.id,
            interval: formData.prices.at(index)!.interval,
            status: formData.prices.at(index)!.status,
            amount: formData.prices.at(index)!.amount,
          })),
        },
      },
    });

    revalidatePath(`/`);

    return { data: plan };
  } catch (error) {
    if (isPrismaError(error)) {
      return {
        errors: ['A project with that name already exists'],
      };
    }

    return {
      errors: [(error as any)?.message ?? 'An error occurred'],
    };
  }
}

export async function updatePlan(id: string, formData: z.infer<typeof CreatePlanSchema>) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error('You have to be logged in to update a project');
  }

  if (user.email !== process.env.SAASFY_ADMIN_EMAIL) {
    throw new Error('You have to be an admin to update a project');
  }

  try {
    formData = CreatePlanSchema.parse(formData);
  } catch (error) {
    return {
      errors: (error as ZodError).errors.map((err) => err.message),
    };
  }

  try {
    const plan = await prisma.plan.findUnique({
      where: {
        id,
      },
      include: {
        prices: true,
      },
    });

    if (!plan) {
      return {
        errors: ['Project not found'],
      };
    }

    if (!plan.stripeProductId) {
      return {
        errors: ['Stripe product not found'],
      };
    }

    const product = await stripe.products.update(plan.stripeProductId, {
      name: formData.name,
    });

    const prices = await Promise.all(
      formData.prices.map((price, index) => {
        if (!plan.prices[index]?.stripePriceId) {
          return stripe.prices.create({
            currency: 'usd',
            unit_amount: price.amount,
            recurring: {
              interval: price.interval,
            },
            product: product.id,
          });
        }

        return stripe.prices.update(plan.prices[index].stripePriceId!, {
          active: price.status === 'active',
        });
      }),
    );

    const updatedPlan = await prisma.plan.update({
      where: {
        id,
      },
      data: {
        ...formData,
        features: formData.features.map((feature) => feature.name),
        slug: slugify(formData.name, { lower: true }),
        stripeProductId: product.id,
        prices: {
          updateMany: plan.prices.map((price, index) => ({
            where: {
              id: price.id,
            },
            data: {
              stripePriceId: prices[index].id,
              status: formData.prices.at(index)!.status,
            },
          })),
          create: prices.slice(plan.prices.length).map((price, index) => ({
            stripePriceId: price.id,
            interval: formData.prices.at(plan.prices.length + index)!.interval,
            status: formData.prices.at(plan.prices.length + index)!.status,
            amount: formData.prices.at(plan.prices.length + index)!.amount,
          })),
        },
      },
    });

    revalidatePath(`/`);

    return { data: updatedPlan };
  } catch (error) {
    return {
      errors: [(error as any)?.message ?? 'An error occurred'],
    };
  }
}
