import { withWorkspaceUser } from '@saasfy/api/server';
import { createAdminClient } from '@saasfy/supabase/server';

export const POST = withWorkspaceUser(
  ['owner', 'member'] as const,
  async ({ req, params, workspace }) => {
    const { name } = await req.json();

    const supabase = createAdminClient();

    const domain = await supabase
      .from('domains')
      .insert({ slug: name, workspace_id: workspace.id })
      .select('*')
      .single();

    const response = await fetch(
      `https://api.vercel.com/v10/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        body: JSON.stringify({ name }),
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    const data = await response.json();

    if (data.error?.code == 'forbidden') {
      return Response.json(
        {
          errors: ['You do not have permission to add a domain to this workspace.'],
          domain: null,
        },
        {
          status: 403,
        },
      );
    } else if (data.error?.code == 'domain_taken') {
      return Response.json(
        {
          errors: ['This domain is already taken.'],
          domain: null,
        },
        {
          status: 409,
        },
      );
    } else {
      return Response.json({
        errors: [],
        domain,
      });
    }
  },
);

export const GET = withWorkspaceUser(['owner', 'member'] as const, async ({ workspace }) => {
  const supabase = createAdminClient();

  const { data: domains, error } = await supabase
    .from('domains')
    .select('*')
    .eq('workspace_id', workspace.id);

  return Response.json(
    {
      domains,
      errors: error ? [error.message] : [],
    },
    {
      status: error ? 500 : 200,
    },
  );
});
