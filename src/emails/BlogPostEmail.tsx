
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
} from '@react-email/components';
import * as React from 'react';

interface BlogPostEmailProps {
    title: string;
    excerpt: string;
    slug: string;
    imageUrl?: string;
    email: string; // Recipient email for unsubscribe link
}

export const BlogPostEmail = ({
    title = 'New Blog Post',
    excerpt = 'Check out our latest article on IndoorDogPark.org!',
    slug = '',
    imageUrl,
    email = '',
}: BlogPostEmailProps) => {
    const siteUrl = 'https://indoordogpark.org';
    const postUrl = `${siteUrl}/blog/${slug}`;

    return (
        <Html>
            <Head />
            <Preview>{title}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={headerTitle}>IndoorDogPark.org</Heading>
                        <Text style={headerSubtitle}>New Blog Post</Text>
                    </Section>

                    <Section style={content}>
                        {imageUrl && (
                            <Img
                                src={imageUrl}
                                alt={title}
                                width="100%"
                                style={featuredImage}
                            />
                        )}

                        <Heading as="h1" style={postTitle}>
                            {title}
                        </Heading>

                        <Text style={paragraph}>
                            {excerpt}
                        </Text>

                        <Section style={ctaContainer}>
                            <Link href={postUrl} style={button}>
                                Read Full Article
                            </Link>
                        </Section>

                        <Section style={footer}>
                            <Text style={footerText}>
                                Happy tail wagging! 🐾<br />
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

export default BlogPostEmail;

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

const headerSubtitle = {
    color: 'rgba(255,255,255,0.9)',
    margin: '5px 0 0 0',
    fontSize: '14px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
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

const postTitle = {
    color: '#111827',
    margin: '0 0 20px 0',
    fontSize: '24px',
    lineHeight: '1.3',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '1.8',
    margin: '0 0 25px 0',
    color: '#4b5563',
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
