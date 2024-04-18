import { withUser } from '@saasfy/api/server';
import { deleteToken, getToken } from '@saasfy/crud/tokens/server';

export const DELETE = withUser<{ tokenId: string }>(async ({ user, params }) => {
  const { errors } = await deleteToken(user.id, params.tokenId);

  return Response.json(
    {
      errors,
      success: !errors,
    },
    {
      status: errors ? 400 : 200,
    },
  );
});

export const GET = withUser<{ tokenId: string }>(async ({ user, params }) => {
  const { data: token, error } = await getToken(user.id, params.tokenId);

  return Response.json(
    {
      token,
      errors: error ? [error.message] : null,
    },
    {
      status: error ? 400 : 200,
    },
  );
});
