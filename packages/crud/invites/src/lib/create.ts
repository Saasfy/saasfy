import { z } from 'zod';

import { createAdminClient } from '@saasfy/supabase/server';

import { CreateInviteSchema } from './schemas';

export async function createInvite(data: z.infer<typeof CreateInviteSchema>) {
  const supabase = createAdminClient();

  const parsed = CreateInviteSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: parsed.error.errors.map((err) => err.message),
      invite: null,
    };
  }

  const { data: invite, error } = await supabase
    .from('workspace_invites')
    .insert({
      email: data.email,
      workspace_id: data.workspace_id,
      expires: data.expires?.toString() ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      role: data.role,
    })
    .select('*')
    .single();

  return {
    errors: error ? [error.message] : null,
    invite,
  };
}
