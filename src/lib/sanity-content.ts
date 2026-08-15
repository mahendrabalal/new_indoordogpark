import { sanityServerClient } from '@/lib/sanity-server';
import imageUrlBuilder from '@sanity/image-url';
import type { PriorityStateConfig, StateCustomContent } from '@/types/state-content';
import type { PriorityCityConfig, CityCustomContent } from '@/types/city-content';

// Image URL builder for Sanity assets
const builder = imageUrlBuilder(sanityServerClient);

function urlFor(source: any) {
  return builder.image(source);
}

// ─── In-memory caches ──────────────────────────────────────────────────────────
let stateCache: PriorityStateConfig[] | null = null;
let cityCache: PriorityCityConfig[] | null = null;
let stateCacheTime = 0;
let cityCacheTime = 0;
const CACHE_TTL = process.env.NODE_ENV === 'development' ? 0 : 5 * 60 * 1000; // Instant in dev, 5 min in prod

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

// ─── State Content ─────────────────────────────────────────────────────────────

export async function getAllStateContent(): Promise<PriorityStateConfig[]> {
  const now = Date.now();
  if (stateCache && (now - stateCacheTime) < CACHE_TTL) {
    return stateCache;
  }

  try {
    const results = await sanityServerClient.fetch(STATE_QUERY);
    stateCache = results;
    stateCacheTime = now;
    return results;
  } catch (error) {
    console.warn('[Sanity] Failed to fetch state content, using cache or empty:', error);
    return stateCache || [];
  }
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

export async function getAllCityContent(): Promise<PriorityCityConfig[]> {
  const now = Date.now();
  if (cityCache && (now - cityCacheTime) < CACHE_TTL) {
    return cityCache;
  }

  try {
    const results = await sanityServerClient.fetch(CITY_QUERY);
    // Map the Sanity results to match PriorityCityConfig shape
    const mapped = results.map((r: any) => ({
      ...r,
      parks: [], // Parks come from static data, not Sanity
    }));
    cityCache = mapped;
    cityCacheTime = now;
    return mapped;
  } catch (error) {
    console.warn('[Sanity] Failed to fetch city content, using cache or empty:', error);
    return cityCache || [];
  }
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
