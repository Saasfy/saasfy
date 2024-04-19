import { withUser } from '@saasfy/api/server';
import { createToken, getTokens } from '@saasfy/crud/tokens/server';

export const GET = withUser(async ({ user }) => {
  const { data: tokens, error } = await getTokens(user.id);

  return Response.json(
    {
      tokens,
      errors: error ? [error.message] : undefined,
    },
    {
      status: error ? 400 : 200,
    },
  );
});

export const POST = withUser(async ({ req, user }) => {
  const data = await req.json();

  const responseData = await createToken(user.id, data);

  return Response.json(responseData, { status: responseData.errors ? 400 : 200 });
});
