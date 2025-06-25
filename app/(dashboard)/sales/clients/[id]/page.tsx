import { mockClients } from '@/lib/data';
import { ClientDetails } from '@/components/clients/client-details';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // IDに基づいてクライアントデータを取得
  const { id } = await params;
  const client = mockClients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="px-4 py-6 max-w-none">
        <p>クライアントが見つかりません</p>
      </div>
    );
  }

  return <ClientDetails client={client} />;
}
