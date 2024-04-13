import { stripe } from '@saasfy/stripe/server';
import { z } from 'zod';
import { getUrl, withWorkspaceAdmin } from '@saasfy/api/server';
import { createAdminClient } from '@saasfy/supabase/server';

const FormData = z.object({
  priceId: z.string(),
  planId: z.string(),
});

export const POST = withWorkspaceAdmin(async ({ req, user, workspace }) => {
  const formData = await req.formData();

  const parsedData = FormData.safeParse({
    priceId: formData.get('priceId'),
    planId: formData.get('planId'),
  });

  if (!parsedData.success) {
    return Response.json(
      { errors: parsedData.error.errors.map((err) => err.message) },
      { status: 400 },
    );
  }

  const { data } = parsedData;

  const supabase = createAdminClient();

  const { data: plan } = await supabase
    .from('plans')
    .select('*, prices(*)')
    .eq('id', data.planId)
    .eq('status', 'active')
    .eq('prices.status', 'active')
    .eq('prices.id', data.priceId)
    .single();

  if (!plan || !plan.prices || plan.prices.length === 0) {
    return Response.redirect(getUrl(req, `${workspace.slug}/settings/upgrade`).toString(), 303);
  }

  const session = await stripe.checkout.sessions.create({
    success_url: getUrl(req, workspace.slug).toString(),
    cancel_url: getUrl(req, `${workspace.slug}/settings/upgrade`).toString(),
    mode: 'subscription',
    customer_email: user.email,
    subscription_data: {
      metadata: {
        ...data,
        workspaceId: workspace.id,
      },
    },
    line_items: [
      {
        price: plan.prices.at(0)!.stripe_price_id!,
        quantity: 1,
      },
    ],
  });

  if (!session || !session.url) {
    return Response.redirect(getUrl(req, `${workspace.slug}/settings/upgrade`), 303);
  }

  return Response.redirect(session.url, 303);
});
