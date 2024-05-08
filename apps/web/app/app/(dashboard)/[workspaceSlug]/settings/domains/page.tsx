import { redirect } from 'next/navigation';

import { ExternalLinkIcon } from 'lucide-react';

import { createAdminClient, getUser } from '@saasfy/supabase/server';
import { Badge } from '@saasfy/ui/badge';

import { AddDomainForm } from './add-form';
import { DomainConfiguration } from './domain-configuration';
import { RemoveDomainButton } from './remove-domain-button';

export default async function Component({ params }: { params: { workspaceSlug: string } }) {
  const user = await getUser();

  if (!user) {
    return redirect('/login');
  }

  const supabase = createAdminClient();

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*, workspace_users!inner(*), domains(*)')
    .eq('slug', params.workspaceSlug)
    .eq('workspace_users.user_id', user.id)
    .single();

  if (!workspace) {
    return null;
  }

  const domains = workspace.domains;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold">Domains</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">
        These domains are assigned to your Production Deployments. Optionally, a different Git
        branch or a redirection to another domain can be configured for each one.
      </p>

      <AddDomainForm />
      <div className="mt-6 space-y-4">
        {domains?.length ? (
          domains.map((domain) => (
            <div
              className="w-full mt-10 sm:shadow-md border-y sm:border border sm:rounded-lg py-10 px-2 sm:px-10"
              key={domain.id}
            >
              <div className="flex justify-between space-x-4">
                <a
                  href={`http://${domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl text-left font-semibold flex items-center"
                >
                  {domain.slug}
                  <span className="inline-block ml-2">
                    <ExternalLinkIcon className={`w-6 h-6`} />
                  </span>
                </a>
                <div className="flex space-x-3">
                  {/* TODO: Implement this #43 */}
                  {/*<Button variant="secondary">Refresh</Button>*/}
                  <RemoveDomainButton domain={domain} workspace={workspace} />
                </div>
              </div>

              <div className="space-x-2">
                {domain.verified ? (
                  <Badge>Verified</Badge>
                ) : (
                  <Badge variant="destructive">Not Verified</Badge>
                )}

                {domain.configured ? (
                  <Badge>Configured</Badge>
                ) : (
                  <Badge variant="destructive">Not Configured</Badge>
                )}
              </div>

              {!domain.verified || !domain.configured ? (
                <DomainConfiguration domain={domain} workspace={workspace} />
              ) : null}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
            No domains added yet.
          </div>
        )}
      </div>
    </div>
  );
}
