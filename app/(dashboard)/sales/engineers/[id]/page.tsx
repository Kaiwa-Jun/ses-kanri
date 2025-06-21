import { mockEngineers } from "@/lib/data";
import { EngineerProfile } from "@/components/engineers/engineer-profile";

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default function EngineerDetailsPage({ params }: { params: { id: string } }) {
  // 実際のアプリでは、APIからデータを取得する
  const engineer = mockEngineers.find((e) => e.id === params.id);
  
  if (!engineer) {
    return (
      <div className="container py-6">
        <p>エンジニアが見つかりません</p>
      </div>
    );
  }
  
  return <EngineerProfile engineer={engineer} />;
}
