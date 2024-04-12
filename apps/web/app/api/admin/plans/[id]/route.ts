import { withAdmin } from '@saasfy/api/server';
import { prisma } from '@saasfy/prisma/server';
import { stripe } from '@saasfy/stripe/server';

export const DELETE = withAdmin<{ id: string }>(async ({ req, params }) => {
  const id = params.id;

  const plan = await prisma.plan.findUnique({
    where: {
      id,
    },
  });

  if (!plan) {
    return Response.json({ error: 'Plan not found' }, { status: 404 });
  }

  plan.stripeProductId && (await stripe.products.del(plan.stripeProductId));

  await prisma.plan.delete({
    where: {
      id,
    },
  });

  return Response.json({ success: true });
});
