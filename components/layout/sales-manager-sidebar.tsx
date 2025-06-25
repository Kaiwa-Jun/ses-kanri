'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
};

export function SalesManagerSidebar() {
  const pathname = usePathname();

  const salesManagerNavItems: NavItem[] = [
    {
      title: '営業一覧',
      href: '/sales-manager/sales',
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 bg-background border-r shadow-sm z-30">
      <div className="flex flex-col h-full w-full">
        <div className="px-3 py-2 flex-1">
          <div className="h-16 flex items-center justify-center border-b">
            <h2 className="text-lg font-semibold">営業管理者メニュー</h2>
          </div>
          <div className="space-y-1 py-4">
            {salesManagerNavItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all relative',
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.icon}
                  {item.title}
                  {item.badge && item.badge > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
