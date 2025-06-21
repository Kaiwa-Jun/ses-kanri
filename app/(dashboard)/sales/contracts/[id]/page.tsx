import { ContractDetails } from "@/components/contracts/contract-details";
import { mockContracts } from "@/lib/data";

// 静的パラメータを生成する関数
export function generateStaticParams() {
  return mockContracts.map((contract) => ({
    id: contract.id,
  }));
}

export default function ContractDetailsPage({ params }: { params: { id: string } }) {
  // IDに基づいて契約データを取得
  const contract = mockContracts.find((c) => c.id === params.id) || mockContracts[0];
  
  return <ContractDetails contract={contract} />;
}