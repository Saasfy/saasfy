import { z, ZodType } from 'zod';
import { Enums, TablesInsert, TablesUpdate } from '@saasfy/supabase';

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  status: z.enum(['active', 'inactive']).optional() satisfies ZodType<
    Enums<'WorkspaceStatus'> | undefined
  >,
  plan_id: z.string().optional(),
  stripe_customer_id: z.string().optional(),
  stripe_subscription_id: z.string().optional(),
  stripe_subscription_status: z
    .enum([
      'incomplete',
      'incomplete_expired',
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid',
      'paused',
    ])
    .optional() satisfies ZodType<Enums<'StripeStatus'> | undefined>,
}) satisfies ZodType<TablesInsert<'workspaces'>>;

export const UpdateWorkspaceSchema = CreateWorkspaceSchema.partial() satisfies ZodType<
  TablesUpdate<'workspaces'>
>;
