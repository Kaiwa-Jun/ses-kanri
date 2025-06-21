import { mockEngineers } from "@/lib/data";
import { EngineerProfile } from "@/components/engineers/engineer-profile";

// 静的ページ生成のためのパラメータを生成
export async function generateStaticParams() {
  return mockEngineers.map((engineer) => ({
    id: engineer.id
  }));
}

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