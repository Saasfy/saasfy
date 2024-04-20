'use server';

import * as process from 'node:process';

import { resend } from '@saasfy/resend/server';

export async function subscribeAction(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    throw new Error('Email is required');
  }

  const response = await resend?.contacts.create({
    audienceId: process.env.RESEND_AUDIENCE_ID!,
    email,
  });

  if (response?.error) {
    throw new Error('Failed to subscribe');
  }
}
