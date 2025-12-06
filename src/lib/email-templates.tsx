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
} from '@react-email/components';

interface AdminNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: string;
}

export function AdminNotificationEmail({
  name,
  email,
  phone,
  subject,
  message,
  category,
}: AdminNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerHeading}>New Contact Form Submission</Heading>
            <Text style={headerText}>You've received a new message from your Indoor Dog Park website.</Text>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={sectionTitle}>Contact Details</Heading>

            <Text style={label}>Name:</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>Email:</Text>
            <Text style={value}>{email}</Text>

            {phone && (
              <>
                <Text style={label}>Phone:</Text>
                <Text style={value}>{phone}</Text>
              </>
            )}

            {category && (
              <>
                <Text style={label}>Category:</Text>
                <Text style={value}>{category}</Text>
              </>
            )}

            <Text style={label}>Subject:</Text>
            <Text style={value}>{subject}</Text>

            <Text style={label}>Message:</Text>
            <Text style={messageStyle}>{message}</Text>

            <Button
              style={replyButton}
              href={`mailto:${email}?subject=Re: ${subject}`}
            >
              Reply to {name}
            </Button>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              This message was sent from the Indoor Dog Park contact form at {new Date().toLocaleString()}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const header = {
  backgroundColor: '#8b5cf6',
  padding: '30px 40px',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
};

const headerHeading = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 10px 0',
};

const headerText = {
  color: '#e9d5ff',
  fontSize: '16px',
  margin: '0',
};

const content = {
  padding: '30px 40px',
};

const sectionTitle = {
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  color: '#1f2937',
};

const label = {
  fontSize: '14px',
  fontWeight: '600',
  margin: '15px 0 5px 0',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const value = {
  fontSize: '16px',
  margin: '0 0 20px 0',
  color: '#1f2937',
};

const messageStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 30px 0',
  color: '#1f2937',
  whiteSpace: 'pre-wrap',
  backgroundColor: '#f9fafb',
  padding: '15px',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
};

const replyButton = {
  backgroundColor: '#8b5cf6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '30px 0 0 0',
};

const divider = {
  border: 'none',
  borderTop: '1px solid #e5e7eb',
  margin: '0',
};

const footer = {
  padding: '20px 40px',
  backgroundColor: '#f9fafb',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
};

const footerText = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0',
};