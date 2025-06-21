import './globals.css';
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

// const inter = Inter({ 
//   subsets: ['latin'],
//   display: 'swap',
//   preload: false,
// });

export const metadata: Metadata = {
  title: 'SESエンジニア管理アプリ',
  description: '社内の営業とSESエンジニアの業務を効率化するための業務支援ツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
