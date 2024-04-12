'use server';

import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { createClient } from '@saasfy/supabase/server';
import { revalidatePath } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { z, ZodError } from 'zod';
import { prisma } from '@saasfy/prisma/server';

const CreateWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
});

function isPrismaError(error: any): error is PrismaClientKnownRequestError {
  return error.code === 'P2002';
}

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
    const workspace = await prisma.workspace.create({
      data: {
        ...data,
        slug: slugify(data.name, { lower: true, trim: true }),
        users: {
          create: {
            role: 'owner',
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
    });

    revalidatePath(`/`);

    return workspace;
  } catch (error) {
    if (isPrismaError(error)) {
      return {
        errors: ['A workspace with that name already exists'],
      };
    }

    return {
      errors: [(error as any)?.message ?? 'An error occurred'],
    };
  }
}
