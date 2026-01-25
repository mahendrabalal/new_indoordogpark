import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Log In | Indoor Dog Park',
    description: 'Sign in to your Indoor Dog Park account to manage your settings and view your favorite parks.',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
        },
    },
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
