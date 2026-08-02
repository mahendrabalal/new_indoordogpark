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

interface ParkOutreachEmailProps {
    parkName: string;
    parkSlug: string;
    parkCity?: string;
    parkState?: string;
    personalizedNote?: string;
    parkEmail: string;
    baseUrl: string;
}

export const ParkOutreachEmail = ({
    parkName,
    parkSlug,
    parkCity,
    parkState,
    personalizedNote,
    parkEmail,
    baseUrl,
}: ParkOutreachEmailProps) => {
    const location = parkCity && parkState ? ` in ${parkCity}, ${parkState}` : '';

    return (
        <Html>
            <Head />
            <Preview>Partner with IndoorDogPark.org</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={headerTitle}>IndoorDogPark.org</Heading>
                        <Text style={headerSubtitle}>America&apos;s Premier Indoor Dog Park Directory</Text>
                    </Section>

                    <Section style={content}>
                        <Heading as="h2" style={greeting}>
                            Hi {parkName}{location ? ' Team' : ''},
                        </Heading>

                        <Text style={paragraph}>
                            We came across <strong>{parkName}</strong>{location} while building out our 2026 directory and wanted to reach out personally. Your facility is now listed on IndoorDogPark.org — one of the fastest-growing directories for dog owners searching for indoor play spaces across the US.
                        </Text>

                        <Text style={paragraph}>
                            Your listing is completely <strong>free</strong> — no sign-up or payment needed.
                        </Text>

                        {personalizedNote && (
                            <Section style={noteContainer}>
                                <div style={noteText} dangerouslySetInnerHTML={{ __html: personalizedNote }} />
                            </Section>
                        )}

                        <Section style={ctaContainer}>
                            <Link href={`${baseUrl}/parks/${parkSlug}`} style={button}>
                                View Your Free Listing →
                            </Link>
                        </Section>

                        <Text style={paragraph}>
                            We also created a free <strong>&quot;Listed on IndoorDogPark.org&quot;</strong> badge you can add to your website. It&apos;s a small trust signal that tells your customers you&apos;re part of a verified directory — similar to a TripAdvisor or Yelp sticker in a restaurant window.
                        </Text>

                        <Heading as="h3" style={subHeading}>
                            How to get your free badge:
                        </Heading>
                        <ul style={list}>
                            <li style={listItem}>
                                1. Click the button above to view your listing.
                            </li>
                            <li style={listItem}>
                                2. On the right side of the page, click <strong>&quot;Get Your Free Badge&quot;</strong>.
                            </li>
                            <li style={listItem}>
                                3. Copy the HTML snippet and paste it anywhere on your site — footer, sidebar, or &quot;About&quot; page.
                            </li>
                        </ul>

                        <Text style={paragraph}>
                            It takes under a minute and costs nothing. If your info on our site needs any updates (hours, photos, amenities), just reply to this email and we&apos;ll fix it right away.
                        </Text>

                        <Section style={footer}>
                            <Text style={footerText}>
                                Best regards,<br />
                                <strong>The IndoorDogPark.org Team</strong><br />
                                <Link href="mailto:media@indoordogpark.org" style={link}>media@indoordogpark.org</Link><br />
                                <Link href={baseUrl} style={link}>indoordogpark.org</Link>
                            </Text>
                        </Section>

                        <Section style={unsubscribe}>
                            <Text style={unsubscribeText}>
                                You&apos;re receiving this because {parkName} is listed in our directory. If you&apos;d prefer not to receive these emails, please <Link href={`${baseUrl}/unsubscribe?email=${encodeURIComponent(parkEmail || '')}`} style={link}>unsubscribe here</Link>.
                            </Text>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ParkOutreachEmail;

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

const noteContainer = {
    background: '#f3f4f6',
    padding: '15px',
    borderLeft: '4px solid #667eea',
    margin: '20px 0',
};

const noteText = {
    margin: '0',
    fontStyle: 'italic',
};

const subHeading = {
    color: '#667eea',
    marginTop: '30px',
};

const list = {
    lineHeight: '1.8',
};

const listItem = {
    marginBottom: '8px',
};

const benefitsContainer = {
    background: '#f9fafb',
    padding: '20px',
    borderRadius: '6px',
    margin: '30px 0',
};

const benefitsTitle = {
    color: '#667eea',
    marginTop: '0',
};

const benefitsList = {
    marginBottom: '0',
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

const link = {
    color: '#667eea',
};

const unsubscribe = {
    marginTop: '30px',
    padding: '15px',
    background: '#f3f4f6',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#6b7280',
};

const unsubscribeText = {
    margin: '0 0 10px 0',
};

const address = {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '8px',
    display: 'block',
};
