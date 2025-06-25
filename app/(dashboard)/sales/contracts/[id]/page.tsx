import { ContractDetails } from '@/components/contracts/contract-details';
import { mockContracts } from '@/lib/data';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default async function ContractDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // IDに基づいて契約データを取得
  const { id } = await params;
  const contract = mockContracts.find((c) => c.id === id) || mockContracts[0];

  return <ContractDetails contract={contract} />;
}
