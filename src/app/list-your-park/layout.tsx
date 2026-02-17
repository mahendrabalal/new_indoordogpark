import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'List Your Dog Park | Indoor Dog Park Directory',
  description: 'Add your indoor dog park, dog daycare, or dog-friendly establishment to the most trusted US directory. Free and featured listing options available.',
  keywords: [
    'list dog park',
    'add dog park',
    'dog park directory',
    'submit dog park',
    'dog park listing',
    'indoor dog park business',
    'dog daycare listing'
  ],
  alternates: {
    canonical: '/list-your-park',
  },
  openGraph: {
    title: 'List Your Dog Park | Indoor Dog Park Directory',
    description: 'Add your indoor dog park, dog daycare, or dog-friendly establishment to the most trusted US directory.',
    url: 'https://www.indoordogpark.org/list-your-park',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ListYourParkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

