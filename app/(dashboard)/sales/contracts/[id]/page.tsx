import { ContractDetails } from '@/components/contracts/contract-details';
import { mockContracts } from '@/lib/data';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default function ContractDetailsPage({ params }: { params: { id: string } }) {
  // IDに基づいて契約データを取得
  const contract = mockContracts.find((c) => c.id === params.id) || mockContracts[0];

  return <ContractDetails contract={contract} />;
}
