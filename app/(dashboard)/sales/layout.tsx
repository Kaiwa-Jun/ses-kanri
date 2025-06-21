import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      <Sidebar />
      <div className="flex-1 w-full pb-16 md:pb-0">{children}</div>
      <MobileNav />
    </div>
  );
}
