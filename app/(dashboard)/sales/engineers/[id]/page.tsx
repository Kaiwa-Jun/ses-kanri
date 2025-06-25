import { mockEngineers } from '@/lib/data';
import { EngineerProfile } from '@/components/engineers/engineer-profile';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default async function EngineerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15では params が非同期になったため await で取得
  const { id } = await params;
  // 実際のアプリでは、APIからデータを取得する
  const engineer = mockEngineers.find((e) => e.id === id);

  if (!engineer) {
    return (
      <div className="px-4 py-6 max-w-none">
        <p>エンジニアが見つかりません</p>
      </div>
    );
  }

  return <EngineerProfile engineer={engineer} />;
}
