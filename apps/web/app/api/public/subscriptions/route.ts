import { stripe } from '@saasfy/stripe/server';
import { z } from 'zod';
import { getUrl } from '@saasfy/api/server';
import { prisma } from '@saasfy/prisma/server';
import { PlanStatus, PriceStatus } from '@prisma/client';

const FormData = z.object({
  priceId: z.string(),
  planId: z.string(),
});

export async function POST(req: Request) {
  const formData = await req.formData();

  const parsedData = FormData.safeParse({
    priceId: formData.get('priceId'),
    planId: formData.get('planId'),
  });

  if (!parsedData.success) {
    return Response.json({ errors: parsedData.error.errors.map((err) => err.message) }, { status: 400 });
  }

  const { data } = parsedData;

  const plan = await prisma.plan.findFirst({
    where: {
      id: data.planId,
      status: PlanStatus.active,
      prices: {
        every: {
          id: data.priceId,
          status: PriceStatus.active,
        },
      },
    },
    include: {
      prices: true,
    },
  });

  if (!plan || !plan.prices || plan.prices.length === 0) {
    return Response.redirect(getUrl(req, '/subscriptions/cancel').toString(), 303);
  }

  const session = await stripe.checkout.sessions.create({
    success_url: getUrl(req, '/subscriptions/success').toString(),
    cancel_url: getUrl(req, '/subscriptions/cancel').toString(),
    mode: 'subscription',
    subscription_data: {
      metadata: {
        ...data,
      },
    },
    line_items: [
      {
        price: plan.prices.at(0)!.stripePriceId!,
        quantity: 1,
      },
    ],
  });

  if (!session || !session.url) {
    return Response.redirect(getUrl(req, '/subscriptions/cancel'), 303);
  }

  return Response.redirect(session.url, 303);
}
