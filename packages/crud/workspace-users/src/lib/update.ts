import { z } from 'zod';

import { createAdminClient } from '@saasfy/supabase/server';

import { UpdateWorkspaceUserSchema } from './schemas';

export async function updateWorkspaceUser(
  id: string,
  data: z.infer<typeof UpdateWorkspaceUserSchema>,
) {
  const supabase = createAdminClient();

  const parsed = UpdateWorkspaceUserSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: parsed.error.errors.map((err) => err.message),
      workspaceUser: null,
    };
  }

  const { data: workspaceUser, error } = await supabase
    .from('workspace_users')
    .update(parsed.data)
    .eq('id', id)
    .select('*')
    .single();

  return {
    errors: error ? [error.message] : null,
    workspaceUser,
  };
}
