'use server';

import slugify from 'slugify';
import { createAdminClient, createClient } from '@saasfy/supabase/server';
import { revalidatePath } from 'next/cache';
import { z, ZodError } from 'zod';

const CreateWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
});

export async function createWorkspace(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error('You have to be logged in to create a workspace');
  }

  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
  };

  try {
    CreateWorkspaceSchema.parse(data);
  } catch (error) {
    return {
      errors: (error as ZodError).errors.map((err) => err.message),
    };
  }

  try {
    const supabase = createAdminClient();

    const { data: workspace } = await supabase
      .from('workspaces')
      .insert({
        name: data.name,
        description: data.description,
        slug: slugify(data.name, { lower: true, trim: true }),
      })
      .select('*')
      .single();

    await supabase.from('workspace_users').insert({
      role: 'owner',
      user_id: user.id,
      workspace_id: workspace!.id,
    });

    revalidatePath(`/`);

    return workspace;
  } catch (error) {
    return {
      errors: [(error as any)?.message ?? 'An error occurred'],
    };
  }
}
