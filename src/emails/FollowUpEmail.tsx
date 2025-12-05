import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface FollowUpEmailProps {
    parkName: string;
    parkCity?: string;
    parkState?: string;
    baseUrl: string;
}

export const FollowUpEmail = ({
    parkName,
    parkCity,
    parkState,
    baseUrl,
}: FollowUpEmailProps) => {
    const location = parkCity && parkState ? ` in ${parkCity}, ${parkState}` : '';

    return (
        <Html>
            <Head />
            <Preview>Quick Follow-Up: {parkName}</Preview>
            <Body style={main}>
                <Container style={content}>
                    <Heading as="h2" style={greeting}>
                        Quick Follow-Up: {parkName}
                    </Heading>

                    <Text style={paragraph}>Hi there,</Text>

                    <Text style={paragraph}>
                        I wanted to follow up on my previous email about featuring {parkName}{location} in our directory. I know you&apos;re busy, so I&apos;ll keep this brief.
                    </Text>

                    <Text style={paragraph}>
                        <strong>Quick question:</strong> Would you be interested in a quick 10-minute call to discuss how we can help drive more customers to your facility?
                    </Text>

                    <Text style={paragraph}>
                        We&apos;ve helped dozens of indoor dog parks increase their visibility and attract more visitors. I&apos;d love to show you how we can do the same for {parkName}.
                    </Text>

                    <Section style={ctaContainer}>
                        <Link href={`${baseUrl}/list-your-park`} style={button}>
                            Schedule a Quick Call
                        </Link>
                    </Section>

                    <Text style={paragraph}>
                        Or if you prefer, you can simply upgrade to a featured listing online - it takes less than 5 minutes.
                    </Text>

                    <Text style={paragraph}>Thanks for your time!</Text>

                    <Section style={footer}>
                        <Text style={footerText}>
                            Best,<br />
                            The IndoorDogPark.org Team<br />
                            <Link href="mailto:partnerships@indoordogpark.org" style={link}>partnerships@indoordogpark.org</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default FollowUpEmail;

const main = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: '1.6',
    color: '#333',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
};

const content = {
    background: '#ffffff',
    padding: '40px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
};

const greeting = {
    color: '#667eea',
    marginTop: '0',
};

const paragraph = {
    margin: '16px 0',
};

const ctaContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const button = {
    display: 'inline-block',
    background: '#667eea',
    color: 'white',
    padding: '12px 25px',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
};

const footer = {
    marginTop: '30px',
    color: '#6b7280',
    fontSize: '14px',
};

const footerText = {
    margin: '0',
};

const link = {
    color: '#667eea',
};
