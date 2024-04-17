import { withPlatformAdmin } from '@saasfy/api/server';
import { stripe } from '@saasfy/stripe/server';
import { createAdminClient } from '@saasfy/supabase/server';

export const DELETE = withPlatformAdmin<{ id: string }>(async ({ req, params }) => {
  const id = params.id;

  const supabase = createAdminClient();

  const { data: plan } = await supabase.from('plans').select('*').eq('id', id).single();

  if (!plan) {
    return Response.json({ error: 'Plan not found' }, { status: 404 });
  }

  plan.stripe_product_id && (await stripe.products.del(plan.stripe_product_id));

  await supabase.from('plans').delete().eq('id', id);

  return Response.json({ success: true });
});
