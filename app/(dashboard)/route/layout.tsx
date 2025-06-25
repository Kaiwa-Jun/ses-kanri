import { RouteSidebar } from '@/components/layout/route-sidebar';
import { RouteMobileNav } from '@/components/layout/route-mobile-nav';

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      <RouteSidebar />
      <div className="flex-1 w-full pb-16 md:pb-0 md:ml-64">{children}</div>
      <RouteMobileNav />
    </div>
  );
}
