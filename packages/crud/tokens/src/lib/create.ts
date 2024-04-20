import { nanoid } from 'nanoid';
import { z } from 'zod';

import { createAdminClient } from '@saasfy/supabase/server';
import { hashToken, maskToken } from '@saasfy/utils/server';

import { CreateTokenSchema } from './schemas';

export async function createToken(userId: string, data: z.infer<typeof CreateTokenSchema>) {
  const supabase = createAdminClient();

  const parsed = CreateTokenSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: parsed.error.errors.map((err) => err.message),
      token: null,
    };
  }

  const token = nanoid(24);
  const hashedToken = hashToken(token);
  const maskedToken = maskToken(token);

  const { data: userToken, error } = await supabase
    .from('tokens')
    .insert({
      hashed: hashedToken,
      masked: maskedToken,
      name: parsed.data.name,
      user: userId,
    })
    .select('*')
    .single();

  return {
    errors: error ? [error.message] : null,
    token: {
      ...userToken,
      token,
    },
  };
}
