import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Button,
  Row,
  Column,
} from '@react-email/components';

interface PremiumListingOfferEmailProps {
  parkName: string;
  recipientName?: string;
  recipientEmail: string;
  parkWebsite?: string;
  parkCity?: string;
  parkState?: string;
  currentRanking?: number;
  totalParks?: number;
  personalizedNote?: string;
}

export function PremiumListingOfferEmail({
  parkName,
  recipientName = "Park Owner",
  recipientEmail,
  parkWebsite,
  parkCity,
  parkState,
  currentRanking,
  totalParks,
  personalizedNote = "",
}: PremiumListingOfferEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Enhanced Listing for {parkName} - Just $9.99/month</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Section */}
          <Section style={header}>
            <Heading style={headerHeading}>🐕 Boost Your Park&apos;s Visibility</Heading>
            <Text style={headerText}>Get featured on California&apos;s #1 Indoor Dog Park Directory</Text>
          </Section>

          {/* Personalized Greeting */}
          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>Hello {recipientName}!</Heading>

            <Text style={paragraph}>
              We&apos;ve noticed {parkName} is one of the wonderful dog parks serving the {parkCity}{parkState && `, ${parkState}`} community. We&apos;re excited to offer you an exclusive opportunity to showcase your park to thousands of dog owners searching for indoor dog parks every month!
            </Text>

            {currentRanking && totalParks && (
              <Section style={statsBox}>
                <Text style={statsText}>
                  📊 Your park is currently ranked <strong>#{currentRanking}</strong> out of <strong>{totalParks}</strong> parks in California
                </Text>
                <Text style={statsSubtext}>
                  A premium listing will place you in the top 3 for your area!
                </Text>
              </Section>
            )}

            {personalizedNote && (
              <Section style={personalizedBox}>
                <Text style={personalizedText}>{personalizedNote}</Text>
              </Section>
            )}

            {/* Premium Benefits */}
            <Heading as="h3" style={benefitsTitle}>✨ Premium Listing Benefits</Heading>

            <Row style={benefitsRow}>
              <Column style={benefitColumn}>
                <Text style={benefitIcon}>🏆</Text>
                <Text style={benefitTitle}>Featured Placement</Text>
                <Text style={benefitDesc}>Appear at the top of search results</Text>
              </Column>
              <Column style={benefitColumn}>
                <Text style={benefitIcon}>📈</Text>
                <Text style={benefitTitle}>Detailed Analytics</Text>
                <Text style={benefitDesc}>Track visitors and engagement</Text>
              </Column>
            </Row>

            <Row style={benefitsRow}>
              <Column style={benefitColumn}>
                <Text style={benefitIcon}>📸</Text>
                <Text style={benefitTitle}>Photo Gallery</Text>
                <Text style={benefitDesc}>Showcase up to 10 photos</Text>
              </Column>
              <Column style={benefitColumn}>
                <Text style={benefitIcon}>🎯</Text>
                <Text style={benefitTitle}>Direct Bookings</Text>
                <Text style={benefitDesc}>Receive booking inquiries</Text>
              </Column>
            </Row>

            {/* Special Offer */}
            <Section style={offerBox}>
              <Heading as="h3" style={offerTitle}>🌟 Enhanced Listing Features</Heading>
              <Text style={offerPrice}>
                <strong>$9.99/month</strong>
              </Text>
              <Text style={offerSubtext}>
                No setup fees • Cancel anytime • Instant activation
              </Text>
            </Section>

            {/* CTA Buttons */}
            <Section style={ctaSection}>
              <Button style={primaryButton} href="https://www.indoordogpark.org/list-your-park">
                Upgrade to Enhanced Listing - $9.99/month
              </Button>

              {parkWebsite && (
                <Button style={secondaryButton} href={parkWebsite}>
                  View Your Current Listing
                </Button>
              )}
            </Section>

            {/* Testimonial */}
            <Section style={testimonialSection}>
              <Text style={testimonialText}>
                &ldquo;After upgrading to premium, we saw a <strong>300% increase</strong> in visitor inquiries! The ROI was incredible.&rdquo;
              </Text>
              <Text style={testimonialAuthor}>
                - Sarah J., Happy Dog Park Owner
              </Text>
            </Section>

            {/* FAQ Preview */}
            <Text style={faqText}>
              Questions? Reply to this email or visit our <a href="https://www.indoordogpark.org/faq" style={link}>FAQ page</a>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Thank you for being part of California&apos;s dog park community!
            </Text>
            <Text style={footerText}>
              Best regards,<br />
              The IndoorDogPark.org Team
            </Text>
            <Text style={footerContact}>
              📧 media@indoordogpark.org<br />
              🌐 www.indoordogpark.org<br />
              📍 Based in California
            </Text>
            <Section style={complianceSection}>
              <Text style={footerText}>
                This email was sent to {recipientEmail} because you operate {parkName} or are associated with it.
              </Text>
              <Text style={footerText}>
                123 Main Street, Suite 100, Los Angeles, CA 90001
              </Text>
              <Text style={unsubscribeText}>
                If you&apos;d prefer not to receive these offers, <a href={`https://www.indoordogpark.org/unsubscribe?email=${encodeURIComponent(recipientEmail)}`} style={link}>unsubscribe here</a>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  lineHeight: '1.6',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
};

const header = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 30px',
  textAlign: 'center' as const,
};

const headerHeading = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 10px 0',
  lineHeight: '1.2',
};

const headerText = {
  color: 'rgba(255, 255, 255, 0.95)',
  fontSize: '18px',
  margin: '0',
  fontWeight: '400',
};

const content = {
  padding: '40px 30px',
};

const sectionTitle = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 20px 0',
};

const paragraph = {
  color: '#4b5563',
  fontSize: '16px',
  margin: '20px 0',
  lineHeight: '1.8',
};

const statsBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '25px 0',
  textAlign: 'center' as const,
};

const statsText = {
  color: '#1e40af',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 10px 0',
};

const statsSubtext = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0',
};

const personalizedBox = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  borderRadius: '8px',
  padding: '20px',
  margin: '25px 0',
};

const personalizedText = {
  color: '#92400e',
  fontSize: '16px',
  fontStyle: 'italic',
  margin: '0',
};

const benefitsTitle = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: '600',
  margin: '30px 0 20px 0',
};

const benefitsRow = {
  marginBottom: '20px',
};

const benefitColumn = {
  width: '48%',
  textAlign: 'center' as const,
  padding: '20px 10px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const benefitIcon = {
  fontSize: '32px',
  margin: '0 0 10px 0',
};

const benefitTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 5px 0',
};

const benefitDesc = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
};

const offerBox = {
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '12px',
  padding: '30px',
  margin: '30px 0',
  textAlign: 'center' as const,
};

const offerTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 15px 0',
};

const offerPrice = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 10px 0',
};

const offerSubtext = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '16px',
  margin: '0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const primaryButton = {
  backgroundColor: '#8b5cf6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 32px',
  margin: '0 auto 15px auto',
  width: '100%',
  maxWidth: '400px',
};

const secondaryButton = {
  backgroundColor: 'transparent',
  border: '2px solid #8b5cf6',
  borderRadius: '8px',
  color: '#8b5cf6',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const testimonialSection = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '25px',
  margin: '30px 0',
  fontStyle: 'italic',
};

const testimonialText = {
  color: '#4b5563',
  fontSize: '16px',
  margin: '0 0 10px 0',
  lineHeight: '1.6',
};

const testimonialAuthor = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
  fontStyle: 'normal',
  fontWeight: '600',
};

const faqText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '20px 0 0 0',
  textAlign: 'center' as const,
};

const link = {
  color: '#8b5cf6',
  textDecoration: 'underline',
};

const divider = {
  border: 'none',
  borderTop: '1px solid #e5e7eb',
  margin: '0',
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '30px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 10px 0',
};

const footerContact = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '20px 0 10px 0',
};

const complianceSection = {
  borderTop: '1px solid #e5e7eb',
  marginTop: '20px',
  paddingTop: '20px',
};

const unsubscribeText = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '10px 0 0 0',
};

export default PremiumListingOfferEmail;