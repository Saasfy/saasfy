import { stripe } from '@saasfy/stripe/server';
import { getUrl, withWorkspaceAdmin } from '@saasfy/api/server';

export const GET = withWorkspaceAdmin(async ({ req, workspace, params }) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: workspace.stripe_customer_id!,
    return_url: getUrl(req, `/${params.workspaceSlug}/settings`).toString(),
  });

  return Response.redirect(session.url, 303);
});
