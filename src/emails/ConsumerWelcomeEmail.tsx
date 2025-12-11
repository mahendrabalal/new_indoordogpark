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

interface ConsumerWelcomeEmailProps {
    email: string;
}

export const ConsumerWelcomeEmail = ({ email }: ConsumerWelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to IndoorDogPark.org!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={headerTitle}>🐕 Welcome to the Pack!</Heading>
                        <Text style={headerSubtitle}>USA&apos;s Premier Indoor Dog Park Directory</Text>
                    </Section>

                    <Section style={content}>
                        <Heading as="h2" style={greeting}>
                            Thanks for Subscribing! 🎉
                        </Heading>

                        <Text style={paragraph}>Hi there!</Text>

                        <Text style={paragraph}>
                            Welcome to the IndoorDogPark.org community! We&apos;re thrilled to have you join thousands of dog lovers discovering amazing indoor dog parks across the USA.
                        </Text>

                        <Section style={benefitsContainer}>
                            <Heading as="h3" style={benefitsTitle}>
                                Here&apos;s what you&apos;ll get:
                            </Heading>
                            <ul style={benefitsList}>
                                <li style={listItem}>🏞️ New park openings in your area</li>
                                <li style={listItem}>💡 Tips for indoor dog park visits</li>
                                <li style={listItem}>🎁 Exclusive deals and discounts</li>
                                <li style={listItem}>📰 Weekly roundup of dog-friendly news</li>
                            </ul>
                        </Section>

                        <Section style={ctaContainer}>
                            <Link href="https://indoordogpark.org" style={button}>
                                Explore Parks Now
                            </Link>
                        </Section>

                        <Text style={paragraph}>
                            In the meantime, check out our latest blog articles or browse parks near you!
                        </Text>

                        <Section style={footer}>
                            <Text style={footerText}>
                                Happy tail wagging! 🐾<br />
                                <strong>The IndoorDogPark.org Team</strong><br />
                                <Link href="mailto:media@indoordogpark.org" style={link}>media@indoordogpark.org</Link><br />
                                <Link href="https://indoordogpark.org" style={link}>indoordogpark.org</Link>
                            </Text>
                        </Section>

                        <Section style={unsubscribe}>
                            <Text style={unsubscribeText}>
                                You&apos;re receiving this because you subscribed to IndoorDogPark.org newsletter.
                            </Text>
                            <Text style={unsubscribeLinks}>
                                <Link href={`https://indoordogpark.org/unsubscribe?email=${encodeURIComponent(email)}`} style={link}>Unsubscribe</Link> |
                                <Link href="https://indoordogpark.org/privacy" style={link}>Privacy Policy</Link>
                            </Text>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ConsumerWelcomeEmail;

const main = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9fafb',
};

const container = {
    margin: '0 auto',
    maxWidth: '600px',
};

const header = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px',
    textAlign: 'center' as const,
    borderRadius: '12px 12px 0 0',
};

const headerTitle = {
    color: 'white',
    margin: '0',
    fontSize: '32px',
};

const headerSubtitle = {
    color: 'rgba(255,255,255,0.95)',
    margin: '15px 0 0 0',
    fontSize: '16px',
};

const content = {
    background: '#ffffff',
    padding: '40px',
    border: '1px solid #e5e7eb',
    borderTop: 'none',
    borderRadius: '0 0 12px 12px',
};

const greeting = {
    color: '#667eea',
    marginTop: '0',
    fontSize: '24px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '1.8',
    margin: '16px 0',
};

const benefitsContainer = {
    background: '#f3f4f6',
    padding: '20px',
    borderLeft: '4px solid #667eea',
    margin: '30px 0',
    borderRadius: '4px',
};

const benefitsTitle = {
    color: '#667eea',
    marginTop: '0',
    fontSize: '18px',
};

const benefitsList = {
    margin: '10px 0',
    paddingLeft: '20px',
    lineHeight: '2',
};

const listItem = {
    marginBottom: '4px',
};

const ctaContainer = {
    textAlign: 'center' as const,
    margin: '40px 0',
};

const button = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '16px 32px',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
};

const footer = {
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
};

const footerText = {
    margin: '0',
    color: '#6b7280',
    fontSize: '14px',
};

const link = {
    color: '#667eea',
    textDecoration: 'none',
};

const unsubscribe = {
    marginTop: '30px',
    padding: '15px',
    background: '#f9fafb',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'center' as const,
};

const unsubscribeText = {
    margin: '0',
};

const unsubscribeLinks = {
    margin: '10px 0 0 0',
};
