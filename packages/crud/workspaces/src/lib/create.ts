import { CreateWorkspaceSchema } from './schemas';
import { z } from 'zod';
import { createAdminClient } from '@saasfy/supabase/server';

export async function createWorkspace(data: z.infer<typeof CreateWorkspaceSchema>) {
  const supabase = createAdminClient();

  const parsed = CreateWorkspaceSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: parsed.error.errors.map((err) => err.message),
      workspace: null,
    };
  }

  const { data: workspace, error } = await supabase
    .from('workspaces')
    .insert(parsed.data)
    .select('*')
    .single();

  return {
    errors: error ? [error.message] : null,
    workspace,
  };
}
