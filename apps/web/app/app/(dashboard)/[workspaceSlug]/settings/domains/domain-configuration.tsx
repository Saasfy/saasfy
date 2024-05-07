'use client';

import { useEffect, useState } from 'react';

import { Tables } from '@saasfy/supabase';

export function DomainConfiguration({
  domain,
  workspace,
}: {
  domain: Tables<'domains'>;
  workspace: Tables<'workspaces'>;
}) {
  const [domainConfig, setDomainConfig] = useState<
    | (Tables<'domains'> & {
        errors: string[] | null;
        apexName: string;
        name: string;
        verified: boolean;
        conflicts: {
          name: string;
          type: string;
          value: string;
        }[];
        verification: {
          domain: string;
          reason: string;
          type: string;
          value: string;
        }[];
      })
    | null
  >(null);

  const [recordType, setRecordType] = useState('A');

  useEffect(() => {
    fetch(`/api/workspaces/${workspace.slug}/domains/${domain.slug}/check`, {
      method: 'POST',
    }).then(async (response) => {
      const data = await response.json();
      setDomainConfig(data);
    });
  }, [domain.slug, domain.verified, workspace.slug, domain.configured]);

  if (!domainConfig) {
    return null;
  }

  const subdomain = getSubdomain(domainConfig.name, domainConfig.apexName);

  if (!domainConfig.verified) {
    const txtVerification = domainConfig.verification.find((x: any) => x.type === 'TXT')!;
    return (
      <div className="border-t mt-4">
        <DnsRecord
          instructions={`Please set the following TXT record on <code>${domainConfig.apexName}</code> to prove ownership of <code>${domainConfig.name}</code>:`}
          records={[
            {
              type: txtVerification.type,
              name: txtVerification.domain.slice(
                0,
                txtVerification.domain.length - domainConfig.apexName.length - 1,
              ),
              value: txtVerification.value,
            },
          ]}
          warning="Warning: if you are using this domain for another site, setting this TXT record will transfer domain ownership away from that site and break it. Please exercise caution when setting this record; make sure that the domain that is shown in the TXT verification value is actually the <b><i>domain you want to use on Dub.co</i></b> – <b><i>not your production site</i></b>."
        />
      </div>
    );
  }

  if (domainConfig?.conflicts?.length) {
    return (
      <div className="border-t mt-4">
        <div className="flex justify-start space-x-4 mt-4">
          <div className="ease border-b pb-1 text-sm text-black dark:text-white transition-all duration-150">
            {domainConfig?.conflicts.some((x) => x.type === 'A')
              ? 'A Record (recommended)'
              : 'CNAME Record (recommended)'}
          </div>
        </div>
        <DnsRecord
          instructions="Please remove the following conflicting DNS records from your DNS provider:"
          records={domainConfig?.conflicts}
        />
        <DnsRecord
          instructions="Afterwards, set the following record on your DNS provider to continue:"
          records={[
            {
              type: recordType,
              name: recordType === 'A' ? '@' : subdomain ?? 'www',
              value: recordType === 'A' ? `76.76.21.21` : `cname.dub.co`,
              ttl: '86400',
            },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="border-t mt-4">
      <div className="flex justify-start space-x-4 mt-4">
        <button
          onClick={() => setRecordType('A')}
          className={`${
            recordType == 'A'
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-white dark:border-black text-gray-400'
          } ease border-b pb-1 text-sm transition-all duration-150`}
        >
          A Record{!subdomain && ' (recommended)'}
        </button>
        <button
          onClick={() => setRecordType('CNAME')}
          className={`${
            recordType == 'CNAME'
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-white dark:border-black text-gray-400'
          } ease border-b pb-1 text-sm transition-all duration-150`}
        >
          CNAME Record{subdomain && ' (recommended)'}
        </button>
      </div>

      <DnsRecord
        instructions={`To configure your ${
          recordType === 'A' ? 'apex domain' : 'subdomain'
        } <code>${
          recordType === 'A' ? domainConfig.apexName : domainConfig.name
        }</code>, set the following ${recordType} record on your DNS provider to
              continue:`}
        records={[
          {
            type: recordType,
            name: recordType === 'A' ? '@' : subdomain ?? 'www',
            value:
              recordType === 'A' ? `76.76.21.21` : `cname.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
            ttl: '86400',
          },
        ]}
      />
    </div>
  );
}

function getSubdomain(name: string, apexName: string) {
  if (name === apexName) {
    return null;
  }

  return name.slice(0, name.length - apexName.length - 1);
}

const MarkdownText = ({ text }: { text: string }) => {
  return (
    <p
      className="prose-sm prose-code:rounded-md
      prose-code:bg-blue-100 dark:prose-code:bg-blue-900
      prose-code:p-1
      prose-code:text-[14px] prose-code:font-medium
      prose-code:font-mono prose-code:text-blue-900 dark:prose-code:text-blue-100
      my-5 max-w-none"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

const DnsRecord = ({
  instructions,
  records,
  warning,
}: {
  instructions: string;
  records: { type: string; name: string; value: string; ttl?: string }[];
  warning?: string;
}) => {
  const hasTtl = records.some((x) => x.ttl);
  return (
    <div className="my-3 text-left">
      <MarkdownText text={instructions} />
      <div className="flex items-center justify-start space-x-10 rounded-md bg-gray-50  p-2 dark:bg-gray-800">
        <div>
          <p className="text-sm font-bold">Type</p>
          {records.map((record) => (
            <p key={record.type} className="mt-2 font-mono text-sm">
              {record.type}
            </p>
          ))}
        </div>
        <div>
          <p className="text-sm font-bold">Name</p>
          {records.map((record) => (
            <p key={record.name} className="mt-2 font-mono text-sm">
              {record.name}
            </p>
          ))}
        </div>
        <div>
          <p className="text-sm font-bold">Value</p>
          {records.map((record) => (
            <p key={record.value} className="mt-2 font-mono text-sm">
              {record.value}
            </p>
          ))}
        </div>
        {hasTtl && (
          <div>
            <p className="text-sm font-bold">TTL</p>
            {records.map((record) => (
              <p key={record.ttl} className="mt-2 font-mono text-sm">
                {record.ttl}
              </p>
            ))}
          </div>
        )}
      </div>
      {(warning || hasTtl) && (
        <MarkdownText
          text={
            warning ||
            'Note: for TTL, if <code>86400</code> is not available, set the highest value possible. Also, domain propagation can take anywhere between 1 hour to 12 hours.'
          }
        />
      )}
    </div>
  );
};
