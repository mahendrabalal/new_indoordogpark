import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign Up | Indoor Dog Park',
    description: 'Create an account with Indoor Dog Park to get the most out of our indoor dog park directory.',
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

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
