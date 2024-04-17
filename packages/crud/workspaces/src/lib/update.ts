import { UpdateWorkspaceSchema } from './schemas';
import { z } from 'zod';
import { createAdminClient } from '@saasfy/supabase/server';

export async function updateWorkspace(id: string, data: z.infer<typeof UpdateWorkspaceSchema>) {
  const supabase = createAdminClient();

  const parsed = UpdateWorkspaceSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: parsed.error.errors.map((err) => err.message),
      workspace: null,
    };
  }

  const { data: workspace, error } = await supabase
    .from('workspaces')
    .update(parsed.data)
    .eq('id', id)
    .select('*')
    .single();

  return {
    errors: error ? [error.message] : null,
    workspace,
  };
}
