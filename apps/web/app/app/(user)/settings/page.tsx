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

export default function Settings() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Username</CardTitle>
          <CardDescription>The username of the account owner.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="Store Name" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </>
  );
}
