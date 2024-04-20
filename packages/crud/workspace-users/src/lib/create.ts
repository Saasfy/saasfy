import { z } from 'zod';

import { createAdminClient } from '@saasfy/supabase/server';

import { CreateWorkspaceUserSchema } from './schemas';

export async function createWorkspaceUser(data: z.infer<typeof CreateWorkspaceUserSchema>) {
  const supabase = createAdminClient();

  const parsed = CreateWorkspaceUserSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: parsed.error.errors.map((err) => err.message),
      workspaceUser: null,
    };
  }

  const { data: workspaceUser, error } = await supabase
    .from('workspace_users')
    .insert(parsed.data)
    .select('*')
    .single();

  return {
    errors: error ? [error.message] : null,
    workspaceUser,
  };
}
