import { z, ZodType } from 'zod';

import { Enums, TablesInsert, TablesUpdate } from '@saasfy/supabase';

export const CreateWorkspaceUserSchema = z.object({
  workspace_id: z.string().min(1, 'Workspace ID is required'),
  user_id: z.string().min(1, 'User ID is required'),
  role: z.enum(['owner', 'member']) satisfies ZodType<Enums<'Role'>>,
}) satisfies ZodType<TablesInsert<'workspace_users'>>;

export const UpdateWorkspaceUserSchema = CreateWorkspaceUserSchema.partial() satisfies ZodType<
  TablesUpdate<'workspace_users'>
>;
