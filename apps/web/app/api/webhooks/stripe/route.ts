import { stripe } from '@saasfy/stripe/server';
import Stripe from 'stripe';
import { createAdminClient, createClient } from '@saasfy/supabase/server';
import { Role, WorkspaceStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@saasfy/prisma/server';

export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: 'Stripe webhook is not configured' }, { status: 400 });
  }

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  const event = safeDecodeEvent(body, sig!, endpointSecret);

  if (!event) {
    return Response.json({ error: 'Stripe webhook signature verification failed' }, { status: 400 });
  }

  switch (event?.type) {
    case 'customer.subscription.created': {
      await createSubscription(event.data.object as Stripe.Subscription);
      break;
    }
    case 'customer.subscription.paused': {
      await updateSubscriptionStatus(event.data.object as Stripe.Subscription);
      break;
    }
    case 'customer.subscription.resumed': {
      await updateSubscriptionStatus(event.data.object as Stripe.Subscription);
      break;
    }
    case 'customer.subscription.updated': {
      await checkPriceChange(event.data.object as Stripe.Subscription);
      break;
    }
    case 'customer.subscription.deleted': {
      await deleteSubscription(event.data.object as Stripe.Subscription);
      break;
    }
  }

  return Response.json({ received: true });
}

function safeDecodeEvent(body: string, sig: string, endpointSecret: string) {
  try {
    return stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return null;
  }
}

async function updateSubscriptionStatus(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;

  await createClient()
    .from('Workspace')
    .update({
      subscriptionStatus: subscription.status,
      status: subscription.status === 'active' ? 'active' : 'inactive',
    })
    .eq('customerId', customerId);
}

async function createSubscription(subscription: Stripe.Subscription) {
  const { planId, workspaceId } = subscription.metadata;

  const customer =
    typeof subscription.customer === 'string'
      ? await stripe.customers.retrieve(subscription.customer)
      : subscription.customer;

  if (customer.deleted) {
    return Response.json({ received: true });
  }

  const user = await prisma.users.findFirst({
    where: {
      email: customer.email,
    },
  });

  let userId = user?.id;

  if (!user) {
    // create user
    const { data, error } = await createAdminClient().auth.admin.createUser({
      email: customer.email!,
    });

    if (error) {
      console.error('Error creating user', error);
      return Response.json({ received: true });
    }

    userId = data.user?.id;
  }

  if (!userId) {
    console.error('User not found');
    return Response.json({ received: true });
  }

  if (!workspaceId) {
    await prisma.workspace.create({
      data: {
        name: 'Saasfy Workspace',
        slug: uuidv4(),
        status: WorkspaceStatus.active,
        customerId: customer.id,
        subscriptionStatus: subscription.status,
        subscriptionId: subscription.id,
        users: {
          create: {
            userId,
            role: Role.owner,
          },
        },
        plan: {
          connect: {
            id: planId,
          },
        },
      },
    });
  } else {
    await prisma.workspace.update({
      where: {
        id: workspaceId,
        users: {
          every: {
            userId,
            role: Role.owner,
          },
        },
      },
      data: {
        subscriptionStatus: subscription.status,
        subscriptionId: subscription.id,
        customerId: customer.id,
        status: WorkspaceStatus.active,
        plan: {
          connect: {
            id: planId,
          },
        },
      },
    });
  }
}

async function checkPriceChange(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0].price.id;
  const supabase = createClient();

  const { data: price } = await supabase.from('Price').select('id, Plan(id)').eq('stripePriceId', priceId).single();

  if (!price) {
    console.error('Plan not found');
    return;
  }

  await supabase.from('Workspace').update({ planId: price.Plan!.id }).eq('subscriptionId', subscription.id);
}

async function deleteSubscription(subscription: Stripe.Subscription) {
  await createClient()
    .from('Workspace')
    .update({
      status: 'inactive',
      planId: null,
      subscriptionId: null,
      subscriptionStatus: 'canceled',
      customerId: null,
    })
    .eq('subscriptionId', subscription.id);
}
