import { SalesManagerSidebar } from '@/components/layout/sales-manager-sidebar';
import { SalesManagerMobileNav } from '@/components/layout/sales-manager-mobile-nav';

export default function SalesManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SalesManagerSidebar />
      <SalesManagerMobileNav />
      <div className="md:ml-64 pb-16 md:pb-0">{children}</div>
    </>
  );
}
