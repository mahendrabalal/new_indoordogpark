import { sanityClient } from '@/lib/sanity-client';
import imageUrlBuilder from '@sanity/image-url';
import { unstable_cache } from 'next/cache';
import type { PriorityStateConfig, StateCustomContent } from '@/types/state-content';
import type { PriorityCityConfig, CityCustomContent } from '@/types/city-content';

// Image URL builder for Sanity assets (uses public CDN client)
const builder = imageUrlBuilder(sanityClient);

function urlFor(source: any) {
  return builder.image(source);
}

// ─── GROQ Queries ──────────────────────────────────────────────────────────────
const STATE_QUERY = `*[_type == "stateContent"] {
  "slug": slug.current,
  name,
  abbr,
  "featuredImage": featuredImage.asset->url,
  customContent {
    heroEyebrow,
    heroHeading,
    heroDescription,
    heroPill,
    heroFootnotes,
    heroImageAlt,
    heroChips[] {
      label,
      value,
      caption
    },
    insightIntro,
    insightCards[] {
      tag,
      title,
      copy,
      accent
    },
    planningCards[] {
      icon,
      title,
      items
    },
    faqs[] {
      question,
      answer,
      category
    },
    ownerCta {
      kicker,
      title,
      description,
      primary { label, href },
      secondary { label, href },
      footnote
    }
  }
}`;

const CITY_QUERY = `*[_type == "cityContent"] {
  "slug": slug.current,
  city,
  state,
  summary,
  "featuredImage": featuredImage.asset->url,
  customContent {
    heroEyebrow,
    heroHeading,
    heroDescription,
    heroPill,
    heroFootnotes,
    heroImageAlt,
    heroChips[] {
      label,
      value,
      caption
    },
    insightIntro,
    insightCards[] {
      tag,
      title,
      copy,
      accent
    },
    planningCards[] {
      icon,
      title,
      items
    },
    mapSidebarNote,
    faqs[] {
      question,
      answer,
      category
    },
    faqSupportCard {
      kicker,
      title,
      description,
      primary { label, href },
      secondary { label, href },
      footnote
    },
    ownerCta {
      kicker,
      title,
      description,
      primary { label, href },
      secondary { label, href },
      footnote
    },
    longDescription,
    neighborhoods[] {
      name,
      slug,
      description
    },
    expertTips
  }
}`;

// In-memory cache with 1-hour TTL to bypass Next.js 2MB unstable_cache item size limit
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cachedStateContent: { data: PriorityStateConfig[]; timestamp: number } | null = null;
let pendingStateFetch: Promise<PriorityStateConfig[]> | null = null;

export async function getAllStateContent(): Promise<PriorityStateConfig[]> {
  const now = Date.now();
  if (cachedStateContent && now - cachedStateContent.timestamp < CACHE_TTL_MS) {
    return cachedStateContent.data;
  }
  if (pendingStateFetch) {
    return pendingStateFetch;
  }
  pendingStateFetch = fetchStateContentRaw()
    .then((data) => {
      cachedStateContent = { data, timestamp: Date.now() };
      pendingStateFetch = null;
      return data;
    })
    .catch((err) => {
      console.warn('[Sanity CDN] Error in state content fetch:', err);
      pendingStateFetch = null;
      return cachedStateContent ? cachedStateContent.data : [];
    });
  return pendingStateFetch;
}

export async function getStateContentBySlug(slug: string): Promise<PriorityStateConfig | null> {
  const all = await getAllStateContent();
  const normalized = slug.toLowerCase().trim();
  return (
    all.find((s) => s?.slug === normalized) ||
    all.find((s) => Boolean(s?.slug && (s.slug.startsWith(`${normalized}-`) || normalized.startsWith(`${s.slug}-`)))) ||
    null
  );
}

// ─── City Content ──────────────────────────────────────────────────────────────

async function fetchCityContentRaw(): Promise<PriorityCityConfig[]> {
  try {
    const results = await sanityClient.fetch<any[]>(CITY_QUERY);
    if (!results) return [];
    // Map the Sanity results to match PriorityCityConfig shape
    return results.map((r: any) => ({
      ...r,
      parks: [], // Parks come from static data, not Sanity
    }));
  } catch (error) {
    console.warn('[Sanity CDN] Failed to fetch city content:', error);
    return [];
  }
}

let cachedCityContent: { data: PriorityCityConfig[]; timestamp: number } | null = null;
let pendingCityFetch: Promise<PriorityCityConfig[]> | null = null;

export async function getAllCityContent(): Promise<PriorityCityConfig[]> {
  const now = Date.now();
  if (cachedCityContent && now - cachedCityContent.timestamp < CACHE_TTL_MS) {
    return cachedCityContent.data;
  }
  if (pendingCityFetch) {
    return pendingCityFetch;
  }
  pendingCityFetch = fetchCityContentRaw()
    .then((data) => {
      cachedCityContent = { data, timestamp: Date.now() };
      pendingCityFetch = null;
      return data;
    })
    .catch((err) => {
      console.warn('[Sanity CDN] Error in city content fetch:', err);
      pendingCityFetch = null;
      return cachedCityContent ? cachedCityContent.data : [];
    });
  return pendingCityFetch;
}

export async function getCityContentBySlug(slug: string): Promise<PriorityCityConfig | null> {
  const all = await getAllCityContent();
  const normalized = slug.toLowerCase().trim();
  return (
    all.find((c) => c?.slug === normalized) ||
    all.find((c) => Boolean(c?.slug && (c.slug.startsWith(`${normalized}-`) || normalized.startsWith(`${c.slug}-`)))) ||
    null
  );
}

// ─── Utility: get all city slugs from Sanity ────────────────────────────────────
export async function getAllSanityCitySlugs(): Promise<string[]> {
  const all = await getAllCityContent();
  return all.map((c) => c.slug);
}

export async function getAllSanityStateSlugs(): Promise<string[]> {
  const all = await getAllStateContent();
  return all.map((s) => s.slug);
}

