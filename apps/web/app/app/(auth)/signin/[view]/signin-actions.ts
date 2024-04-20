'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { z, ZodError } from 'zod';

import { createAuthClient } from '@saasfy/supabase/server';

const LoginSchema = z.object({
  email: z.string().email().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const SignupSchema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function login(formData: FormData) {
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  try {
    LoginSchema.parse(data);
  } catch (error) {
    return {
      errors: (error as ZodError).errors.map((err) => err.message),
    };
  }

  const { error } = await createAuthClient().signInWithPassword(data);

  if (error) {
    return {
      errors: [error.message],
    };
  }

  revalidatePath('/');
}

export async function signup(formData: FormData) {
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirm-password') as string,
  };

  try {
    SignupSchema.parse(data);
  } catch (error: any) {
    return {
      errors: (error as ZodError).errors.map((err) => err.message),
    };
  }

  const { error } = await createAuthClient().signUp(data);

  if (error) {
    return {
      errors: [error.message],
    };
  }

  revalidatePath('/');
}

export async function forgotPassword(formData: FormData) {
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
  };

  try {
    LoginSchema.pick({ email: true }).parse(data);
  } catch (error: any) {
    return {
      errors: (error as ZodError).errors.map((err) => err.message),
    };
  }

  const { error } = await createAuthClient().resetPasswordForEmail(data.email);

  if (error) {
    return {
      errors: [error.message],
    };
  }

  revalidatePath('/');
  redirect('/signin/check-your-email');
}
