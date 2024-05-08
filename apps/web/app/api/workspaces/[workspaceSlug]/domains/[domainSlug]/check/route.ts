import { withWorkspaceUser } from '@saasfy/api/server';
import { createAdminClient } from '@saasfy/supabase/server';

type VercelError = {
  error: {
    code: string;
    message: string;
  };
};

export const POST = withWorkspaceUser<{ domainSlug: string }>(
  ['owner', 'member'] as const,
  async ({ workspace, params }) => {
    const supabase = createAdminClient();

    const { data: domain } = await supabase
      .from('domains')
      .select('*')
      .eq('slug', params.domainSlug)
      .eq('workspace_id', workspace.id)
      .single();

    if (!domain) {
      return Response.json(
        {
          errors: ['Domain not found'],
          domain: null,
        },
        {
          status: 404,
        },
      );
    }

    if (domain.verified && domain.configured) {
      return Response.json(
        {
          ...domain,
          errors: null,
        },
        {
          status: 200,
        },
      );
    }

    const [vercelDomainConfigResponse, vercelDomainResponse] = await Promise.all([
      fetch(
        `https://api.vercel.com/v6/domains/${domain.slug}/config?teamId=${process.env.TEAM_ID_VERCEL}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      ),
      fetch(
        `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain.slug}?teamId=${process.env.TEAM_ID_VERCEL}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    ]);

    const vercelDomainConfig = (await vercelDomainConfigResponse.json()) as {
      misconfigured: boolean;
      error: string;
      conflicts: {
        name: string;
        type: string;
        value: string;
      }[];
    };

    const vercelDomain = (await vercelDomainResponse.json()) as {
      apexName: string;
      name: string;
      verified: boolean;
      verification: {
        domain: string;
        reason: string;
        type: string;
        value: string;
      }[];
    } & VercelError;

    if (vercelDomainResponse.status !== 200) {
      return Response.json(
        {
          ...domain,
          errors: vercelDomain.error ? [vercelDomain.error.message] : null,
        },
        {
          status: vercelDomainResponse.status,
        },
      );
    }

    /**
     * If domain is not verified, we try to verify now
     */
    let domainVerification = null;
    if (!vercelDomain.verified) {
      const domainVerificationResponse = await fetch(
        `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${params.domainSlug}/verify?teamId=${process.env.TEAM_ID_VERCEL}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      domainVerification = (await domainVerificationResponse.json()) as {
        apexName: string;
        name: string;
        verified: boolean;
        verification: {
          domain: string;
          reason: string;
          type: string;
          value: string;
        }[];
      } & VercelError;

      if (domainVerificationResponse.status !== 200) {
        return Response.json(
          {
            ...domain,
            ...vercelDomain,
            errors: domainVerification.error ? [domainVerification.error.message] : null,
          },
          {
            status: domainVerificationResponse.status,
          },
        );
      }
    }

    if (
      ((domainVerification && domainVerification.verified) || vercelDomain.verified) &&
      !domain.verified
    ) {
      await supabase.from('domains').update({ verified: true }).eq('id', domain.id);
    }

    if (!vercelDomainConfig.misconfigured && !domain.configured) {
      await supabase.from('domains').update({ configured: true }).eq('id', domain.id);
    }

    return Response.json({
      ...domain,
      ...vercelDomain,
      ...(domainVerification ? domainVerification : {}),
      conflicts: vercelDomainConfig.conflicts,
      configured: !vercelDomainConfig.misconfigured,
      errors: null,
    });
  },
);
