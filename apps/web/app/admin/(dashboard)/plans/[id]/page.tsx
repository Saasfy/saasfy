import { CreatePlanForm } from '@saasfy/components';
import { createClient } from '@saasfy/supabase/server';

export default async function EditFormPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const supabase = createClient();

  const { data: plan } = await supabase.from('Plan').select('*, Price(*)').eq('id', id).single();

  return (
    <CreatePlanForm
      defaultValues={
        {
          ...plan,
          prices: plan?.Price.map((price) => ({
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
