import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import HelpPageClient from './HelpPageClient';

export const metadata: Metadata = {
  title: 'Help Center - IndoorDogPark',
  description: 'Contact IndoorDogPark support, browse help topics, and track system status.',
};

export default function HelpPage() {
  return (
    <PageLayout>
      <HelpPageClient />
    </PageLayout>
  );
}

