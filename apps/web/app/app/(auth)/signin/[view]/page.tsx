import { redirect } from 'next/navigation';

import { getUser } from '@saasfy/supabase/server';

import { SignInForm, type SignInViews } from './signin-form';

const views: SignInViews[] = ['signin', 'signup', 'forgot-password'];

export default async function SignInViews({ params }: { params: { view: SignInViews } }) {
  let { view = 'signin' } = params;

  if (!views.includes(view)) {
    view = 'signin';
  }

  const user = await getUser();

  if (user) {
    return redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignInForm view={view} />
    </div>
  );
}
