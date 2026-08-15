import OutreachStudioPage from '@/app/outreach-studio/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Outreach Email Studio | Admin Dashboard',
  robots: { index: false, follow: false },
};

export default function AdminOutreachPage() {
  return <OutreachStudioPage />;
}
