import { withWorkspaceUser } from '@saasfy/api/server';
import { createAdminClient } from '@saasfy/supabase/server';

export const GET = withWorkspaceUser<{ domainSlug: string }>(
  ['owner', 'member'] as const,
  async ({ workspace, params }) => {
    const supabase = createAdminClient();

    const { data: domain, error } = await supabase
      .from('domains')
      .select('*')
      .eq('workspace_id', workspace.id)
      .eq('slug', params.domainSlug)
      .single();

    return Response.json(
      {
        domain,
        errors: error ? [error.message] : [],
      },
      {
        status: error ? 500 : 200,
      },
    );
  },
);

export const DELETE = withWorkspaceUser<{ domainSlug: string }>(
  ['owner', 'member'] as const,
  async ({ workspace, params }) => {
    const supabase = createAdminClient();

    const response = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${params.domainSlug}?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        },
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      return Response.json(
        {
          errors: ['Failed to delete domain from Vercel'],
        },
        {
          status: response.status,
        },
      );
    }

    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('workspace_id', workspace.id)
      .eq('slug', params.domainSlug);

    return Response.json(
      {
        errors: error ? [error.message] : [],
      },
      {
        status: error ? 500 : 200,
      },
    );
  },
);
