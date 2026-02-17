import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Unsubscribe',
    description: 'Unsubscribe from indoor dog park updates.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function UnsubscribeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
