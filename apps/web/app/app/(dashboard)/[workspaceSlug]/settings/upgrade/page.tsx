import { prisma } from '@saasfy/prisma/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@saasfy/ui/card';
import { Button } from '@saasfy/ui/button';
import Link from 'next/link';

export default async function Upgrade({ params }: { params: { workspaceSlug: string } }) {
  const plans = await prisma.plan.findMany({
    where: {
      status: 'active',
    },
    include: {
      prices: true,
    },
  });

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Choose Your Plan</h1>
      <p className="text-lg text-center mb-12 px-4 md:px-0 max-w-[700px]">
        We offer different plans to meet your needs. Choose the one that suits you best.
      </p>
      <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-3 w-full max-w-6xl">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {plan.features?.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              {plan.prices?.map((price) => (
                <div className="text-4xl font-bold my-4" key={price.id}>
                  ${price.amount / 100}/{price.interval}
                </div>
              ))}
              <form action={`/api/workspaces/${params.workspaceSlug}/subscription/checkout`} method="post">
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
            <ul className="list-disc list-inside space-y-2">
              <li>Custom Features</li>
              <li>Custom Support</li>
              <li>Estimate on request</li>
            </ul>
            <div className="text-4xl font-bold my-4">Contact Us</div>
            <Button className="w-full" asChild>
              <Link href="mailto:igor@katsuba.dev">Get in Touch</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
