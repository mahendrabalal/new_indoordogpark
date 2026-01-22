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
    parkCity?: string;
    parkState?: string;
    personalizedNote?: string;
    parkEmail: string;
    baseUrl: string;
}

export const ParkOutreachEmail = ({
    parkName,
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
                        <Text style={headerSubtitle}>California&apos;s Premier Indoor Dog Park Directory</Text>
                    </Section>

                    <Section style={content}>
                        <Heading as="h2" style={greeting}>
                            Hello {parkName}{location ? ' Team' : ''}!
                        </Heading>

                        <Text style={paragraph}>
                            We&apos;re reaching out because {parkName}{location} is already featured in our comprehensive directory of indoor dog parks. We&apos;d love to help you get more visibility and connect with more dog owners in your area.
                        </Text>

                        {personalizedNote && (
                            <Section style={noteContainer}>
                                <Text style={noteText}>{personalizedNote}</Text>
                            </Section>
                        )}

                        <Heading as="h3" style={subHeading}>
                            Why Partner With Us?
                        </Heading>
                        <ul style={list}>
                            <li style={listItem}>
                                <strong>Increased Visibility:</strong> Featured listings appear at the top of search results and on our homepage
                            </li>
                            <li style={listItem}>
                                <strong>More Customers:</strong> We help thousands of dog owners find the perfect indoor park every month
                            </li>
                            <li style={listItem}>
                                <strong>Professional Listing:</strong> Enhanced profiles with multiple photos, detailed amenities, and verified information
                            </li>
                            <li style={listItem}>
                                <strong>Analytics Dashboard:</strong> Track views, clicks, and inquiries from your listing
                            </li>
                            <li style={listItem}>
                                <strong>Affordable Pricing:</strong> Starting at just $9.99/month for featured placement
                            </li>
                        </ul>

                        <Section style={benefitsContainer}>
                            <Heading as="h3" style={benefitsTitle}>
                                Featured Listing Benefits:
                            </Heading>
                            <ul style={benefitsList}>
                                <li style={listItem}>✅ Priority placement in search results</li>
                                <li style={listItem}>✅ Featured badge on your listing</li>
                                <li style={listItem}>✅ Homepage visibility</li>
                                <li style={listItem}>✅ Highlighted on interactive map</li>
                                <li style={listItem}>✅ Enhanced listing with more photos</li>
                            </ul>
                        </Section>

                        <Section style={ctaContainer}>
                            <Link href={`${baseUrl}/list-your-park`} style={button}>
                                Upgrade to Featured Listing
                            </Link>
                        </Section>

                        <Text style={paragraph}>
                            Our featured listing at just $9.99/month includes all these benefits to help grow your business.
                        </Text>

                        <Text style={paragraph}>
                            If you have any questions or would like to discuss partnership opportunities, please don&apos;t hesitate to reach out. We&apos;re here to help your business grow!
                        </Text>

                        <Section style={footer}>
                            <Text style={footerText}>
                                Best regards,<br />
                                <strong>The IndoorDogPark.org Team</strong><br />
                                <Link href="mailto:media@indoordogpark.org" style={link}>media@indoordogpark.org</Link><br />
                                <Link href={baseUrl} style={link}>indoordogpark.org</Link><br />
                                <span style={address}>123 Pet Friendly Way, Sacramento, CA 95814</span>
                            </Text>
                        </Section>

                        <Section style={unsubscribe}>
                            <Text style={unsubscribeText}>
                                <strong>P.S.</strong> We&apos;re currently offering a special promotion: First month 50% off for new featured listings. Use code <strong>FIRST50</strong> at checkout.
                            </Text>
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
