import { Client } from 'pg';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

import { stripe } from '@saasfy/stripe/server';
import { createAdminClient } from '@saasfy/supabase/server';

export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: 'Stripe webhook is not configured' }, { status: 400 });
  }

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  const event = safeDecodeEvent(body, sig!, endpointSecret);

  if (!event) {
    return Response.json(
      { error: 'Stripe webhook signature verification failed' },
      { status: 400 },
    );
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
  const customerId =
    typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;

  await createAdminClient()
    .from('workspaces')
    .update({
      stripe_subscription_status: subscription.status,
      status: subscription.status === 'active' ? 'active' : 'inactive',
    })
    .eq('stripe_customer_id', customerId);
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

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  await client.connect();

  const { rows } = await client.query(
    `SELECT *
     FROM auth.users
     WHERE email = '${customer.email}' LIMIT 1`,
  );

  await client.end();

  const user = rows.at(0)!;

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
    const { data: newWorkspace } = await createAdminClient()
      .from('workspaces')
      .insert({
        name: 'Saasfy Workspace',
        slug: uuidv4(),
        status: 'active',
        stripe_customer_id: customer.id,
        stripe_subscription_status: subscription.status,
        stripe_subscription_id: subscription.id,
        plan_id: planId,
      })
      .select('id')
      .single();

    await createAdminClient()
      .from('workspace_users')
      .insert({
        workspace_id: newWorkspace!.id,
        user_id: userId as unknown as string,
        role: 'owner',
      });
  } else {
    await createAdminClient()
      .from('workspaces')
      .update({
        status: 'active',
        stripe_customer_id: customer.id,
        stripe_subscription_status: subscription.status,
        stripe_subscription_id: subscription.id,
        plan_id: planId,
      })
      .eq('id', workspaceId)
      .eq('users.role', 'owner')
      .eq('users.user_id', userId as unknown as string);
  }
}

async function checkPriceChange(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0].price.id;
  const supabase = createAdminClient();

  const { data: price } = await supabase
    .from('prices')
    .select('id, plans(id)')
    .eq('stripe_price_id', priceId)
    .single();

  if (!price) {
    console.error('Plan not found');
    return;
  }

  await supabase
    .from('workspaces')
    .update({ plan_id: price.plans!.id })
    .eq('stripe_subscription_id', subscription.id);
}

async function deleteSubscription(subscription: Stripe.Subscription) {
  await createAdminClient()
    .from('workspaces')
    .update({
      status: 'inactive',
      plan_id: null,
      stripe_subscription_id: null,
      stripe_subscription_status: 'canceled',
      stripe_customer_id: null,
    })
    .eq('stripe_subscription_id', subscription.id);
}
