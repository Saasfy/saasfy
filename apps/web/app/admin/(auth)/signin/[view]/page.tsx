import { getUser } from '@saasfy/supabase/server';
import { redirect } from 'next/navigation';
import { SignInForm } from '../../../../app/(auth)/signin/[view]/signin-form';
import * as process from 'process';

export default async function SignInViews() {
  const user = await getUser();

  if (user && user.email === process.env.SAASFY_ADMIN_EMAIL) {
    return redirect('/');
  }

  return (
    <div className="flex justify-center min-h-screen items-center">
      <SignInForm view="signin" />
    </div>
  );
}
