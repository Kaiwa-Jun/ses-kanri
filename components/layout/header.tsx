'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RocketIcon, Users } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const isCurrentRole = (role: string) => {
    return pathname.startsWith(`/${role}`);
  };

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
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">SES管理</span>
            </Link>
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex gap-2"
            >
              <Button
                variant={isCurrentRole('sales') ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={() => router.push('/sales/projects')}
              >
                <RocketIcon className="w-4 h-4" />
                営業
              </Button>

              <Button
                variant={isCurrentRole('engineer') ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={() => router.push('/engineer/dashboard')}
              >
                <Users className="w-4 h-4" />
                エンジニア
              </Button>
            </motion.div>

            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
