import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Outreach Studio' },
  robots: {
    index: false,
    follow: false,
  },
};

export default function OutreachStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
