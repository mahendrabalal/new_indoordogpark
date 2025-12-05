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

interface OwnerWelcomeEmailProps {
    baseUrl: string;
}

export const OwnerWelcomeEmail = ({ baseUrl }: OwnerWelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to the Partner Network</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={headerTitle}>Welcome to Our Partner Network!</Heading>
                        <Text style={headerSubtitle}>Let&apos;s Grow Your Dog Park Business Together</Text>
                    </Section>

                    <Section style={content}>
                        <Heading as="h2" style={greeting}>
                            Thanks for Joining! 🚀
                        </Heading>

                        <Text style={paragraph}>Hello fellow dog park enthusiast!</Text>

                        <Text style={paragraph}>
                            Welcome to the IndoorDogPark.org partner network! We&apos;re excited to help you grow your business and connect with more dog owners.
                        </Text>

                        <Heading as="h3" style={subHeading}>
                            As a partner, you&apos;ll receive:
                        </Heading>
                        <ul style={list}>
                            <li style={listItem}>📊 Industry insights and trends</li>
                            <li style={listItem}>💰 Revenue optimization tips</li>
                            <li style={listItem}>🎯 Marketing strategies that work</li>
                            <li style={listItem}>🤝 Partnership opportunities</li>
                            <li style={listItem}>⚡ Early access to new features</li>
                        </ul>

                        <Section style={offerContainer}>
                            <Heading as="h3" style={offerTitle}>
                                🎁 Special Offer: First Month 50% Off
                            </Heading>
                            <Text style={offerText}>
                                Ready to get featured? Use code <strong style={code}>FIRST50</strong> at checkout.
                            </Text>
                        </Section>

                        <Section style={ctaContainer}>
                            <Link href={`${baseUrl}/list-your-park`} style={button}>
                                List Your Park Now
                            </Link>
                        </Section>

                        <Text style={paragraph}>
                            Have questions? Just reply to this email or reach out to our partnerships team. We&apos;re here to help!
                        </Text>

                        <Section style={footer}>
                            <Text style={footerText}>
                                To your success! 🌟<br />
                                <strong>The IndoorDogPark.org Partnerships Team</strong>
                            </Text>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default OwnerWelcomeEmail;

const main = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
};

const container = {
    margin: '0 auto',
    maxWidth: '600px',
};

const header = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px',
    textAlign: 'center' as const,
    borderRadius: '8px 8px 0 0',
};

const headerTitle = {
    color: 'white',
    margin: '0',
    fontSize: '28px',
};

const headerSubtitle = {
    color: 'rgba(255,255,255,0.9)',
    margin: '10px 0 0 0',
};

const content = {
    background: '#ffffff',
    padding: '40px',
    border: '1px solid #e5e7eb',
    borderTop: 'none',
    borderRadius: '0 0 8px 8px',
};

const greeting = {
    color: '#667eea',
    marginTop: '0',
};

const paragraph = {
    margin: '16px 0',
};

const subHeading = {
    color: '#667eea',
    marginTop: '30px',
};

const list = {
    lineHeight: '1.8',
    listStyleType: 'none',
    paddingLeft: '0',
};

const listItem = {
    marginBottom: '8px',
};

const offerContainer = {
    background: '#f3f4f6',
    padding: '20px',
    borderRadius: '6px',
    margin: '30px 0',
    borderLeft: '4px solid #667eea',
};

const offerTitle = {
    color: '#667eea',
    marginTop: '0',
};

const offerText = {
    margin: '10px 0',
    fontSize: '15px',
};

const code = {
    background: '#FF5722',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
};

const ctaContainer = {
    textAlign: 'center' as const,
    margin: '40px 0',
};

const button = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '15px 30px',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '16px',
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
