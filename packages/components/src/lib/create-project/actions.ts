'use server';

import { createAdminClient, createClient } from '@saasfy/supabase/server';
import { revalidatePath } from 'next/cache';
import { z, ZodError } from 'zod';
import slugify from 'slugify';

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  workspaceSlug: z.string(),
});

export async function createProject(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error('You have to be logged in to create a project');
  }

  const data = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) ?? undefined,
    workspaceSlug: formData.get('workspaceSlug') as string,
  };

  try {
    CreateProjectSchema.parse(data);
  } catch (error) {
    return {
      errors: (error as ZodError).errors.map((err) => err.message),
    };
  }

  const { workspaceSlug, ...project } = data;

  try {
    const supabase = createAdminClient();

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*, workspace_users(*)')
      .eq('slug', workspaceSlug)
      .eq('workspace_users.user_id', user.id)
      .single();

    if (!workspace) {
      return {
        errors: ['You do not have permission to access this source'],
      };
    }

    const { data: createProject } = await supabase
      .from('projects')
      .insert({
        name: data.name,
        description: data.description,
        slug: slugify(data.name, { lower: true }),
        workspace_id: workspace.id,
      })
      .select('*')
      .single();

    revalidatePath(`/`);

    return createProject;
  } catch (error) {
    return {
      errors: [(error as any)?.message ?? 'An error occurred'],
    };
  }
}
