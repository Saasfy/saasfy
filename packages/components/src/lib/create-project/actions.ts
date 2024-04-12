'use server';

import { PrismaClient } from '@prisma/client';
import { createClient } from '@saasfy/supabase/server';
import { revalidatePath } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { z, ZodError } from 'zod';
import slugify from 'slugify';
import { prisma } from '@saasfy/prisma/server';

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  workspaceSlug: z.string(),
});

function isPrismaError(error: any): error is PrismaClientKnownRequestError {
  return error.code === 'P2002';
}

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
    const createProject = await prisma.project.create({
      data: {
        ...project,
        slug: slugify(data.name, { lower: true }),
        workspace: {
          connect: {
            slug: workspaceSlug,
          },
        },
      },
    });

    revalidatePath(`/`);

    return createProject;
  } catch (error) {
    if (isPrismaError(error)) {
      return {
        errors: ['A project with that name already exists'],
      };
    }

    return {
      errors: [(error as any)?.message ?? 'An error occurred'],
    };
  }
}
