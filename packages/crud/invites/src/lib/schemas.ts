import { z, ZodType } from 'zod';

import { TablesInsert } from '@saasfy/supabase';

export const CreateInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  expires: z.coerce.date().default(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)),
  workspace_id: z.string().min(1, 'Workspace ID is required'),
  role: z.enum(['owner', 'member']).default('member' as const),
}) satisfies ZodType<Omit<TablesInsert<'workspace_invites'>, 'expires'>>;
