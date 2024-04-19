import { Button } from '@saasfy/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@saasfy/ui/card';
import { Input } from '@saasfy/ui/input';
import { createAdminClient, getUser } from '@saasfy/supabase/server';
import { revalidatePath } from 'next/cache';

async function updateName(formData: FormData) {
  'use server';

  const user = await getUser();

  if (!user) {
    return;
  }

  const name = formData.get('name');

  await createAdminClient().auth.admin.updateUserById(user.id, {
    user_metadata: {
      name,
    },
  });

  revalidatePath('/settings');
}

export default async function Settings() {
  const user = await getUser();

  if (!user) {
    return (
      <div>
        <h1>Not logged in</h1>
        <p>You need to be logged in to access this page.</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Name</CardTitle>
          <CardDescription>The name of the account owner.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="nameForm">
            <Input placeholder="Store Name" name="name" defaultValue={user.user_metadata.name} />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" form="nameForm" formAction={updateName}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
