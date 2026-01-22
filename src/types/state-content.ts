import { FAQItem } from '@/types/faq';
import { SupportCTA, HeroChip, CityInsightCard, PlanningCard } from './city-content';

export interface StateCustomContent {
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
    faqs?: FAQItem[];
    ownerCta?: SupportCTA;
}

export interface PriorityStateConfig {
    slug: string;
    name: string;
    abbr: string;
    featuredImage: string;
    customContent: StateCustomContent;
}
