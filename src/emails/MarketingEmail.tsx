
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Markdown,
} from '@react-email/components';
import * as React from 'react';

interface MarketingEmailProps {
    headline: string;
    bodyContent: string; // Markdown supported
    ctaText?: string;
    ctaUrl?: string;
    imageUrl?: string;
    email?: string; // For unsubscribe
}

export const MarketingEmail = ({
    headline = 'Big News from IndoorDogPark.org',
    bodyContent = 'We have some exciting updates for you...',
    ctaText,
    ctaUrl,
    imageUrl,
    email = '',
}: MarketingEmailProps) => {
    const siteUrl = 'https://indoordogpark.org';

    return (
        <Html>
            <Head />
            <Preview>{headline}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={headerTitle}>IndoorDogPark.org</Heading>
                    </Section>

                    <Section style={content}>
                        {imageUrl && (
                            <Img
                                src={imageUrl}
                                alt={headline}
                                width="100%"
                                style={featuredImage}
                            />
                        )}

                        <Heading as="h1" style={title}>
                            {headline}
                        </Heading>

                        <div style={markdownContainer}>
                            <Markdown
                                markdownCustomStyles={{
                                    p: { ...paragraph },
                                    li: { ...listItem },
                                }}
                            >
                                {bodyContent}
                            </Markdown>
                        </div>

                        {ctaText && ctaUrl && (
                            <Section style={ctaContainer}>
                                <Link href={ctaUrl} style={button}>
                                    {ctaText}
                                </Link>
                            </Section>
                        )}

                        <Section style={footer}>
                            <Text style={footerText}>
                                Best,<br />
                                <strong>The IndoorDogPark.org Team</strong><br />
                                <Link href="mailto:media@indoordogpark.org" style={link}>media@indoordogpark.org</Link><br />
                                <Link href={siteUrl} style={link}>indoordogpark.org</Link>
                            </Text>
                        </Section>

                        <Section style={unsubscribe}>
                            <Text style={unsubscribeText}>
                                You received this because you are subscribed to our newsletter.
                            </Text>
                            <Text style={unsubscribeLinks}>
                                <Link href={`${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}`} style={link}>Unsubscribe</Link> |
                                <Link href={`${siteUrl}/privacy`} style={link}>Privacy Policy</Link>
                            </Text>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default MarketingEmail;

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
    padding: '30px',
    textAlign: 'center' as const,
    borderRadius: '12px 12px 0 0',
};

const headerTitle = {
    color: 'white',
    margin: '0',
    fontSize: '26px',
    fontWeight: 'bold',
};

const content = {
    background: '#ffffff',
    padding: '40px',
    border: '1px solid #e5e7eb',
    borderTop: 'none',
    borderRadius: '0 0 12px 12px',
};

const featuredImage = {
    borderRadius: '8px',
    marginBottom: '25px',
    objectFit: 'cover' as const,
    height: 'auto',
};

const title = {
    color: '#111827',
    margin: '0 0 20px 0',
    fontSize: '24px',
    lineHeight: '1.3',
};

const markdownContainer = {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '1.8',
};

const paragraph = {
    marginBottom: '16px',
};

const listItem = {
    marginBottom: '8px',
};

const ctaContainer = {
    textAlign: 'center' as const,
    margin: '35px 0',
};

const button = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '14px 28px',
    textDecoration: 'none',
    borderRadius: '50px',
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
