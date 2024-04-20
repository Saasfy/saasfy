import Link from 'next/link';

import { createAdminClient } from '@saasfy/supabase/server';
import { Button } from '@saasfy/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@saasfy/ui/card';

export default async function Upgrade({ params }: { params: { workspaceSlug: string } }) {
  const supabase = createAdminClient();

  const { data: plans } = await supabase
    .from('plans')
    .select('*, prices(*)')
    .eq('status', 'active');

  return (
    <>
      <h1 className="mb-6 text-4xl font-bold">Choose Your Plan</h1>
      <p className="mb-12 max-w-[700px] px-4 text-center text-lg md:px-0">
        We offer different plans to meet your needs. Choose the one that suits you best.
      </p>
      <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
        {plans?.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2">
                {plan.features?.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              {plan.prices?.map((price) => (
                <div className="my-4 text-4xl font-bold" key={price.id}>
                  ${price.amount / 100}/{price.interval}
                </div>
              ))}
              <form
                action={`/api/workspaces/${params.workspaceSlug}/subscription/checkout`}
                method="post"
              >
                <input type="hidden" name="planId" value={plan.id} />
                <input type="hidden" name="priceId" value={plan.prices.at(0)?.id} />
                <Button className="w-full">Choose Plan</Button>
              </form>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For large teams with custom needs.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2">
              <li>Custom Features</li>
              <li>Custom Support</li>
              <li>Estimate on request</li>
            </ul>
            <div className="my-4 text-4xl font-bold">Contact Us</div>
            <Button className="w-full" asChild>
              <Link href="mailto:igor@katsuba.dev">Get in Touch</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
