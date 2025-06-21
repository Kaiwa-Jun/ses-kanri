import { mockClients } from '@/lib/data';
import { ClientDetails } from '@/components/clients/client-details';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  // IDに基づいてクライアントデータを取得
  const client = mockClients.find((c) => c.id === params.id);

  if (!client) {
    return (
      <div className="container py-6">
        <p>クライアントが見つかりません</p>
      </div>
    );
  }

  return <ClientDetails client={client} />;
}
