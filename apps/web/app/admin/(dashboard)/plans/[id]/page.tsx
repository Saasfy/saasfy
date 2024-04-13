import { CreatePlanForm } from '@saasfy/components';
import { createAdminClient } from '@saasfy/supabase/server';

export default async function EditFormPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const supabase = createAdminClient();

  const { data: plan } = await supabase.from('plans').select('*, prices(*)').eq('id', id).single();

  return (
    <CreatePlanForm
      defaultValues={
        {
          ...plan,
          prices: plan?.prices.map((price) => ({
            amount: price.amount / 100,
            interval: price.interval,
            status: price.status,
          })),
          features: plan?.features?.map((feature) => ({ name: feature })) ?? [],
        } as any
      }
      id={id}
    />
  );
}
