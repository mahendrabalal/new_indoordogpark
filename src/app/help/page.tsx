import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import HelpPageClient from './HelpPageClient';

export const metadata: Metadata = {
  title: 'Help Center - IndoorDogPark',
  description: 'Contact IndoorDogPark support, browse help topics, and track system status.',
  alternates: {
    canonical: '/help',
  },
  openGraph: {
    title: 'Help Center - IndoorDogPark',
    description: 'Contact IndoorDogPark support, browse help topics, and track system status.',
    url: 'https://www.indoordogpark.org/help',
    type: 'website',
  },
};

export default function HelpPage() {
  return (
    <PageLayout>
      <HelpPageClient />
    </PageLayout>
  );
}

