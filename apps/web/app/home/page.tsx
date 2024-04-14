import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@saasfy/ui/card';
import { Button } from '@saasfy/ui/button';
import { CloudIcon, CloudyIcon, HelpCircleIcon, UploadIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@saasfy/ui/accordion';
import { ThemeModeToggle } from '@saasfy/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@saasfy/ui/tabs';
import { SignInMock } from './examples/sign-in.mock';
import { WorkspaceListMock } from './examples/workspace-list.mock';
import { AdminPlansMock } from './examples/admin-plans.mock';
import { Badge } from '@saasfy/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@saasfy/ui/tooltip';
import { SubscribeForm } from './subscribe-form';
import { createAdminClient } from '@saasfy/supabase/server';

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b justify-between">
        <div className="flex justify-start">
          <Link className="flex items-center justify-center" href="#">
            <CloudyIcon className="h-6 w-6" />
            <span className="sr-only">Saasfy</span>
          </Link>
          <nav className="flex gap-4 sm:gap-6 ml-4">
            <Link
              className="text-sm font-medium hover:underline underline-offset-4 text-foreground/60"
              href="#pages"
            >
              Pages
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4 text-foreground/60"
              href="#pricing"
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4 text-foreground/60"
              href="#faq"
            >
              FAQ
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4 text-foreground/60"
              href="#subscribe"
            >
              Subscribe
            </Link>
          </nav>
        </div>

        <div>
          <ThemeModeToggle />
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Early Access
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Build your own SaaS
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Buy our template and start building your SaaS product today. Saasfy offers a range
                  of features to help you get started.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 px-8">
          <Tabs defaultValue="signin" id="pages" orientation="vertical">
            <TabsList className="h-auto flex-wrap justify-start">
              <TabsTrigger value="signin">Sign in page</TabsTrigger>
              <TabsTrigger value="workspace-list">Workspace list</TabsTrigger>
              <TabsTrigger value="plans">Manage subscription plans</TabsTrigger>
              <TabsTrigger value="more" disabled>
                More
                <Badge className={'ml-2'} color={'red'}>
                  Cooming Soon
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <SignInMock />
              </div>
            </TabsContent>
            <TabsContent value="workspace-list">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                <WorkspaceListMock />
              </div>
            </TabsContent>
            <TabsContent value="plans">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <AdminPlansMock />
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 ">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why Choose Saasfy?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Saasfy offers a wide range of features designed to help you build and scale your
                  SaaS. Here are just a few of our favorites.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-8">
                  <CloudIcon className="h-10 w-10" />
                  <h3 className="text-xl font-bold">Cloud-Based</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Access your data from anywhere with our secure, cloud-based platform.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-8">
                  <UploadIcon className="h-10 w-10" />
                  <h3 className="text-xl font-bold">Every day updates</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    We are constantly updating our platform to provide you with the latest features
                    and improvements.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-8">
                  <HelpCircleIcon className="h-10 w-10" />
                  <h3 className="text-xl font-bold">Transparency</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    We believe in transparency and are committed to providing you with the best
                    possible service.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 mx-auto max-w-[480px]" id="faq">
          <FAQ />
        </section>

        <section
          className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center"
          id="pricing"
        >
          <Plans />
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" id="subscribe">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Stay in the Loop
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Subscribe to our newsletter to get the latest updates on Saasfy.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <SubscribeForm />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Saasfy. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          {/*<Link className="text-xs hover:underline underline-offset-4" href="#">*/}
          {/*  Terms of Service*/}
          {/*</Link>*/}
          {/*<Link className="text-xs hover:underline underline-offset-4" href="/privacy">*/}
          {/*  Privacy*/}
          {/*</Link>*/}
        </nav>
      </footer>
    </div>
  );
}

async function Plans() {
  const supabase = createAdminClient();

  const { data: plans, error } = await supabase
    .from('plans')
    .select('*, prices(*)')
    .eq('status', 'active')
    .eq('prices.status', 'active');

  if (error) {
    console.error(error);
    return <div>Error loading plans</div>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Choose Your Plan</h1>
      <p className="text-lg text-center mb-12 px-4 md:px-0 max-w-[700px]">
        We offer different plans to meet your needs. Choose the one that suits you best.
      </p>
      <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-3 w-full max-w-6xl">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col justify-between">
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
              <form action={`/api/public/subscriptions`} method="post">
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

function FAQ() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <Accordion className="w-full" collapsible type="single">
        <AccordionItem value="question1">
          <AccordionTrigger className="text-base font-semibold">What is Saasfy?</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">
              Saasfy is a template designed to help you build your SaaS product. It provides a range
              of features and components that can be customized to suit your needs.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question2">
          <AccordionTrigger className="text-base font-semibold">
            How do I customize Saasfy for my product?
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">
              Saasfy is built with customization in mind. You can easily change colors, fonts,
              layouts and add or remove components as needed. Our documentation{' '}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge>?</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>{' '}
              provides detailed instructions on how to make these changes.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question3">
          <AccordionTrigger className="text-base font-semibold">
            Do I need coding skills to use Saasfy?
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">
              Yes! You will need some basic knowledge of HTML, CSS and JavaScript to customize
              Saasfy for your product. Our documentation{' '}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge>?</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>{' '}
              provides step-by-step instructions and we also offer support if you need help.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question4">
          <AccordionTrigger className="text-base font-semibold">
            Can I use Saasfy for non-SaaS products?
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">
              Absolutely! While Saasfy is designed with SaaS products in mind, it can be customized
              to suit any type of product or service. But keep in mind that some features may not be
              relevant to your product.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
