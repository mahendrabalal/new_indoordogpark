import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: ReactNode;
  mainClassName?: string;
}

export default function PageLayout({ children, mainClassName = '' }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className={`flex-1 ${mainClassName}`}>{children}</main>
      <Footer />
    </div>
  );
}

