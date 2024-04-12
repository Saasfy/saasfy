import { createClient } from '@saasfy/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProjectPage({ params }: { params: { project: string } }) {
  const supabase = createClient();

  const { data: projects } = await supabase.from('Project').select('*').eq('slug', params.project);

  if (!projects?.length) {
    return redirect('/not-found');
  }

  return (
    <div className="flex items-center">
      <h1 className="font-semibold text-lg md:text-2xl">{projects.at(0)?.name}</h1>
    </div>
  );
}
