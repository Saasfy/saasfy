import { withUser } from '@saasfy/api/server';
import { createToken } from '@saasfy/crud/tokens/server';

export const POST = withUser(async ({ req, user }) => {
  const data = await req.json();

  const responseData = await createToken(user.id, data);

  return Response.json(responseData, { status: responseData.errors ? 400 : 200 });
});
