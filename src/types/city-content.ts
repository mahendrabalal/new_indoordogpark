import { FAQItem } from '@/types/faq';
import { DogPark } from './dog-park';

export interface CTAButton {
  label: string;
  href: string;
}

export interface SupportCTA {
  kicker?: string;
  title: string;
  description: string;
  primary: CTAButton;
  secondary?: CTAButton;
  footnote?: string;
}

export interface CityInsightCard {
  tag: string;
  title: string;
  copy: string;
  accent?: boolean;
}

export interface PlanningCard {
  icon: string;
  title: string;
  items: string[];
}

export interface HeroChip {
  label: string;
  value: string;
  caption?: string;
}

export interface CityCustomContent {
  heroEyebrow?: string;
  heroHeading?: string;
  heroDescription?: string;
  heroPill?: string;
  heroFootnotes?: string[];
  heroImageAlt?: string;
  heroChips?: HeroChip[];
  insightIntro?: string;
  insightCards?: CityInsightCard[];
  planningCards?: PlanningCard[];
  mapSidebarNote?: string;
  faqs?: FAQItem[];
  faqSupportCard?: SupportCTA;
  ownerCta?: SupportCTA;
}

export interface PriorityCityConfig {
  slug: string;
  city: string;
  state: string;
  featuredImage: string;
  summary: string;
  parks: DogPark[];
  customContent: CityCustomContent;
}










