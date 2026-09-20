import React from 'react';
import { SITE_URL } from '@/lib/metadata';

export interface ToolStructuredDataProps {
  name: string;
  description: string;
  url: string;
  category?: string;
  citations?: Array<{ organization: string; title: string; url?: string }>;
  reviewerName?: string;
  lastReviewed?: string;
}

export default function ToolStructuredData({
  name,
  description,
  url,
  category = 'Veterinary & Pet Health',
  citations = [],
  reviewerName,
  lastReviewed = '2026-08-01',
}: ToolStructuredDataProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${url}#webpage`,
    name,
    description,
    url,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Indoor Dog Park Directory & Tools',
      url: SITE_URL,
    },
    about: {
      '@type': 'MedicalAudience',
      audienceType: 'Dog Owners, Pet Parents, Veterinary Caretakers',
    },
    lastReviewed,
    ...(reviewerName && {
      reviewedBy: {
        '@type': 'Person',
        name: reviewerName,
        jobTitle: 'Veterinary Medical Consultant',
      },
    }),
    ...(citations.length > 0 && {
      citation: citations.map((c) => ({
        '@type': 'CreativeWork',
        name: `${c.organization} - ${c.title}`,
        ...(c.url && { url: c.url }),
      })),
    }),
    mainEntity: {
      '@type': 'WebApplication',
      name,
      description,
      applicationCategory: category,
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
