'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const isRouteSection = pathname.startsWith('/route');

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto max-w-[1400px] 2xl:max-w-[1536px] 2xl:px-24">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <Link href="/sales/projects" className="flex items-center space-x-2">
              <span className="font-bold text-xl">SES管理</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            {/* タブナビゲーション */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Link
                href="/sales/projects"
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  !isRouteSection
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                営業
              </Link>
              <Link
                href="/route/stores"
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  isRouteSection
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                ルート
              </Link>
            </div>
            <span className="text-sm font-medium text-muted-foreground">管理システム</span>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
