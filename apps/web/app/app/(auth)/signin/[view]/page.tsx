import { SignInForm, type SignInViews } from './signin-form';
import { getUser } from '@saasfy/supabase/server';
import { redirect } from 'next/navigation';

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
    <div className="flex justify-center min-h-screen items-center">
      <SignInForm view={view} />
    </div>
  );
}
