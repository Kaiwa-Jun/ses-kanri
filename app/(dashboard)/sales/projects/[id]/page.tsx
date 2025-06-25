import { mockProjects, getMatchingEngineers } from '@/lib/data';
import { ProjectDetails } from '@/components/projects/project-details';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15では params が非同期になったため await で取得
  const { id } = await params;
  // 実際のアプリでは、APIからデータを取得する
  const project = mockProjects.find((p) => p.id === id);
  const matchingEngineers = getMatchingEngineers(id);

  if (!project) {
    return (
      <div className="px-4 py-6 max-w-none">
        <p>案件が見つかりません</p>
      </div>
    );
  }

  return <ProjectDetails project={project} matchingEngineers={matchingEngineers} />;
}
