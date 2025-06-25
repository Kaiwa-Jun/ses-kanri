'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Store } from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export function RouteMobileNav() {
  const pathname = usePathname();

  const routeNavItems: NavItem[] = [
    {
      title: '加盟店',
      href: '/route/stores',
      icon: <Store className="h-5 w-5" />,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <div className="grid grid-cols-1 h-16">
        {routeNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-xs font-medium',
              pathname === item.href ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
