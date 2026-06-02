import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SafetyCheckerFooter from '@/components/tools/SafetyCheckerFooter';

interface PageLayoutProps {
  children: ReactNode;
  mainClassName?: string;
  hideSafetyChecker?: boolean;
}

export default function PageLayout({ children, mainClassName = '', hideSafetyChecker = false }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Header variant="light" />
      {/* Add top padding to account for fixed header */}
      <main className={`flex-1 pt-[70px] ${mainClassName}`}>{children}</main>
      {!hideSafetyChecker && <SafetyCheckerFooter />}
      <Footer />
    </div>
  );
}

