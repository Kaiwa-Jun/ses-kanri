'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Briefcase, BarChart2, Users, FileText, Bell, Building2 } from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
};

export function Sidebar() {
  const pathname = usePathname();

  const salesNavItems: NavItem[] = [
    // {
    //   title: 'ダッシュボード',
    //   href: '/sales/dashboard',
    //   icon: <Home className="h-5 w-5" />,
    // },
    {
      title: '案件一覧',
      href: '/sales/projects',
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: 'エンジニア一覧',
      href: '/sales/engineers',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'クライアント一覧',
      href: '/sales/clients',
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      title: '契約管理',
      href: '/sales/contracts',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: '稼働状況（WBS）',
      href: '/sales/wbs',
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      title: '営業チーム管理',
      href: '/sales/teams',
      icon: <Building2 className="h-5 w-5" />,
    },
    // {
    //   title: '権限管理',
    //   href: '/sales/permissions',
    //   icon: <Shield className="h-5 w-5" />,
    // },
    {
      title: '通知',
      href: '/sales/notifications',
      icon: <Bell className="h-5 w-5" />,
      badge: 7, // 通知数を表示
    },
  ];

  return (
    <div className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 bg-background border-r shadow-sm z-30">
      <div className="flex flex-col h-full w-full">
        <div className="px-3 py-2 flex-1">
          <div className="h-16 flex items-center justify-center border-b">
            <h2 className="text-lg font-semibold">営業メニュー</h2>
          </div>
          <div className="space-y-1 py-4">
            {salesNavItems.map((item, index) => (
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
