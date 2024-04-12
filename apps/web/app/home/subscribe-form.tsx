'use client';

import { Input } from '@saasfy/ui/input';
import { Button } from '@saasfy/ui/button';
import { subscribeAction } from './subscribe-action';
import { useToast } from '@saasfy/ui/use-toast';

export function SubscribeForm() {
  const { toast } = useToast();

  return (
    <>
      <form className="flex space-x-2">
        <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" name="email" />
        <Button
          type="submit"
          formAction={async (formData) => {
            try {
              await subscribeAction(formData);

              toast({
                title: 'Subscribed!',
                description: 'You have successfully subscribed to our newsletter.',
              });
            } catch (error) {
              toast({
                title: 'Error',
                description: 'An error occurred while subscribing to our newsletter.',
                variant: 'destructive',
              });
            }
          }}
        >
          Subscribe
        </Button>
      </form>
      {/*<p className="text-xs text-gray-500 dark:text-gray-400">*/}
      {/*  By subscribing, you agree to our&nbsp;*/}
      {/*  <Link className="underline underline-offset-2" href="#">*/}
      {/*    Terms & Conditions*/}
      {/*  </Link>*/}
      {/*  .*/}
      {/*</p>*/}
    </>
  );
}
