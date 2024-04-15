'use server';

import { createAdminClient, createClient } from '@saasfy/supabase/server';
import { revalidatePath } from 'next/cache';
import { z, ZodError } from 'zod';
import { stripe } from '@saasfy/stripe/server';
import slugify from 'slugify';

const CreatePlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  status: z.enum(['active', 'inactive'], {
    description: 'Status must be either active or inactive',
  }),
  max_users: z.coerce
    .number()
    .min(1, 'Max users must be greater than 0')
    .int('Max users must be a whole number'),
  max_projects: z.coerce
    .number()
    .nonnegative('Max projects must be greater than or equal to 0')
    .int('Max projects must be a whole number'),
  max_domains: z.coerce
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
      interval: z.enum(['month', 'year']),
      status: z.enum(['active', 'inactive']),
      amount: z.coerce
        .number()
        .min(0, 'Amount must be greater than or equal to 0')
        .transform((value) => Math.round(value * 100)),
    }),
  ),
});

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

    const supabase = createAdminClient();

    const { data: plan } = await supabase
      .from('plans')
      .insert({
        slug: slugify(formData.name, { lower: true }),
        stripe_product_id: product.id,
        features: formData.features.map((feature) => feature.name),
        description: formData.description,
        max_domains: formData.max_domains,
        max_projects: formData.max_projects,
        max_users: formData.max_users,
        name: formData.name,
        status: formData.status,
      })
      .select('id')
      .single();

    if (!plan) {
      return {
        errors: ['An error occurred'],
      };
    }

    await supabase.from('prices').insert(
      prices.map((price, index) => ({
        plan_id: plan.id,
        stripe_price_id: price.id,
        interval: formData.prices.at(index)!.interval,
        status: formData.prices.at(index)!.status,
        amount: formData.prices.at(index)!.amount,
      })),
    );

    revalidatePath(`/`);

    return { data: plan };
  } catch (error) {
    return {
      errors: [(error as any)?.message ?? 'An error occurred'],
    };
  }
}

export async function updatePlan(id: string, formData: z.infer<typeof CreatePlanSchema>) {
  const {
    data: { user },
    error,
  } = await createClient().auth.getUser();

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

  const supabase = createAdminClient();

  try {
    const { data: plan } = await supabase
      .from('plans')
      .select('stripe_product_id, prices(id, stripe_price_id)')
      .eq('id', id)
      .single();

    if (!plan) {
      return {
        errors: ['Project not found'],
      };
    }

    if (!plan.stripe_product_id) {
      return {
        errors: ['Stripe product not found'],
      };
    }

    const product = await stripe.products.update(plan.stripe_product_id, {
      name: formData.name,
    });

    const prices = await Promise.all(
      formData.prices.map((price, index) => {
        if (!plan.prices[index]?.stripe_price_id) {
          return stripe.prices.create({
            currency: 'usd',
            unit_amount: price.amount,
            recurring: {
              interval: price.interval,
            },
            product: product.id,
          });
        }

        return stripe.prices.update(plan.prices[index].stripe_price_id!, {
          active: price.status === 'active',
        });
      }),
    );

    const { data: updatedPlan } = await supabase
      .from('plans')
      .update({
        slug: slugify(formData.name, { lower: true }),
        stripe_product_id: product.id,
        features: formData.features.map((feature) => feature.name),
        description: formData.description,
        max_domains: formData.max_domains,
        max_projects: formData.max_projects,
        max_users: formData.max_users,
        name: formData.name,
        status: formData.status,
      })
      .eq('id', id)
      .select('*')
      .single();

    await supabase
      .from('prices')
      .upsert(
        prices.map((price, index) => ({
          plan_id: id,
          stripe_price_id: price.id,
          interval: formData.prices.at(index)!.interval,
          status: formData.prices.at(index)!.status,
          amount: formData.prices.at(index)!.amount,
        })),
      )
      .eq('plan_id', id);

    revalidatePath(`/home`);

    return { data: updatedPlan };
  } catch (error) {
    return {
      errors: [(error as any)?.message ?? 'An error occurred'],
    };
  }
}
