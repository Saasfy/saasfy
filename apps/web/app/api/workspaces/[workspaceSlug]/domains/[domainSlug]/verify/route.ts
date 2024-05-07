import { withWorkspaceUser } from '@saasfy/api/server';

export const POST = withWorkspaceUser<{ domainSlug: string }>(
  ['owner', 'member'] as const,
  async ({ workspace, params }) => {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${params.domainSlug}/verify?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    const data = await response.json();

    return Response.json(
      {
        errors: [],
        data,
      },
      {
        status: response.status,
      },
    );
  },
);
