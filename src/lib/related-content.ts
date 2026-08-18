import { DogPark } from '@/types/dog-park';
import { BlogPost, WPCategory, WPTag } from '@/types/wordpress';
import { getAllStaticParks } from './parks-data';
import { getCachedPosts, getCachedCategories, getCachedTags } from './sanity-api';

/**
 * Get blog posts related to a park based on city, business type, or keywords
 */
export async function getRelatedBlogPosts(
  park: DogPark,
  limit: number = 3
): Promise<BlogPost[]> {
  try {
    const allPosts = await getCachedPosts({ page: 1, perPage: 50 });
    const posts = allPosts.posts || [];

    // Extract keywords from park
    const cityName = park.city.toLowerCase();
    const businessType = park.businessType.toLowerCase();

    // Score posts based on relevance
    const scoredPosts = posts.map((post) => {
      let score = 0;
      const postTitle = post.title.toLowerCase();
      const postContent = post.content.toLowerCase();
      const postExcerpt = post.excerpt.toLowerCase();

      // High score for city mentions
      if (postTitle.includes(cityName) || postContent.includes(cityName) || postExcerpt.includes(cityName)) {
        score += 10;
      }

      // Score for business type keywords
      const businessKeywords = ['indoor dog park', 'dog park', 'training', 'agility', 'daycare', 'boarding'];
      businessKeywords.forEach((keyword) => {
        if (businessType.includes(keyword) && (postTitle.includes(keyword) || postContent.includes(keyword))) {
          score += 5;
        }
      });

      // Score for category/tag matches
      post.categories.forEach((cat) => {
        const catName = cat.name.toLowerCase();
        if (catName.includes('dog park') || catName.includes('training') || catName.includes('care')) {
          score += 3;
        }
      });

      post.tags.forEach((tag) => {
        const tagName = tag.name.toLowerCase();
        if (tagName === cityName || tagName.includes('dog park') || tagName.includes('training')) {
          score += 3;
        }
      });

      return { post, score };
    });

    // Sort by score and return top results
    return scoredPosts
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.post);
  } catch (error) {
    console.error('Error fetching related blog posts:', error);
    return [];
  }
}

/**
 * Get parks related to a blog post based on city mentions, keywords, or categories
 */
export async function getRelatedParks(
  blogPost: BlogPost,
  limit: number = 6
): Promise<DogPark[]> {
  try {
    const allParks = await getAllStaticParks();
    const postTitle = blogPost.title.toLowerCase();
    const postContent = blogPost.content.toLowerCase();
    const postExcerpt = blogPost.excerpt.toLowerCase();

    // US state abbreviation to full name mapping for state validation
    const stateNames: Record<string, string> = {
      'AL': 'alabama', 'AK': 'alaska', 'AZ': 'arizona', 'AR': 'arkansas', 'CA': 'california',
      'CO': 'colorado', 'CT': 'connecticut', 'DE': 'delaware', 'FL': 'florida', 'GA': 'georgia',
      'HI': 'hawaii', 'ID': 'idaho', 'IL': 'illinois', 'IN': 'indiana', 'IA': 'iowa',
      'KS': 'kansas', 'KY': 'kentucky', 'LA': 'louisiana', 'ME': 'maine', 'MD': 'maryland',
      'MA': 'massachusetts', 'MI': 'michigan', 'MN': 'minnesota', 'MS': 'mississippi', 'MO': 'missouri',
      'MT': 'montana', 'NE': 'nebraska', 'NV': 'nevada', 'NH': 'new hampshire', 'NJ': 'new jersey',
      'NM': 'new mexico', 'NY': 'new york', 'NC': 'north carolina', 'ND': 'north dakota', 'OH': 'ohio',
      'OK': 'oklahoma', 'OR': 'oregon', 'PA': 'pennsylvania', 'RI': 'rhode island', 'SC': 'south carolina',
      'SD': 'south dakota', 'TN': 'tennessee', 'TX': 'texas', 'UT': 'utah', 'VT': 'vermont',
      'VA': 'virginia', 'WA': 'washington', 'WV': 'west virginia', 'WI': 'wisconsin', 'WY': 'wyoming',
      'DC': 'district of columbia',
    };

    // Helper: check if a state (abbreviation or full name) is mentioned in the article
    const allText = `${postTitle} ${postContent} ${postExcerpt}`; // lowercased
    const originalText = `${blogPost.title} ${blogPost.content} ${blogPost.excerpt}`; // original case
    const isStateMentioned = (stateAbbr: string): boolean => {
      const abbr = stateAbbr.toUpperCase();
      const fullName = stateNames[abbr];
      // Check full state name with word boundaries against lowercased text
      if (fullName) {
        const stateRegex = new RegExp(`\\b${fullName}\\b`, 'i');
        if (stateRegex.test(allText)) return true;
      }
      // Check abbreviation against ORIGINAL text (abbreviations are uppercase, e.g. "GA")
      const abbrRegex = new RegExp(`\\b${abbr}\\b`);
      if (abbrRegex.test(originalText)) return true;
      return false;
    };

    // Extract city names from post using word boundaries AND state validation
    // A city only counts as "mentioned" if BOTH the city name and its state appear in the article
    const cityStateKeywords: Array<{ city: string; state: string }> = [];
    allParks.forEach((park) => {
      const cityName = park.city.toLowerCase();
      const parkState = park.state;
      if (!cityName || cityName.length < 3) return;
      
      const escapedCityName = cityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const cityRegex = new RegExp(`\\b${escapedCityName}\\b`, 'i');
      
      const cityFound = cityRegex.test(postTitle) || cityRegex.test(postContent) || cityRegex.test(postExcerpt);
      const stateFound = isStateMentioned(parkState);
      
      if (
        cityFound && stateFound &&
        !cityStateKeywords.some(cs => cs.city === cityName && cs.state === parkState)
      ) {
        cityStateKeywords.push({ city: cityName, state: parkState });
      }
    });

    // Score parks based on relevance
    const scoredParks = allParks.map((park) => {
      let score = 0;
      const parkName = park.name.toLowerCase();
      const parkCity = park.city.toLowerCase();
      const parkState = park.state;

      // High score for city+state match (ensures only local parks get boosted)
      if (cityStateKeywords.some(cs => cs.city === parkCity && cs.state === parkState)) {
        score += 30;
      }

      // Score for name mentions
      // Using word boundaries to prevent substring matching
      const escapedParkName = parkName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parkNameRegex = new RegExp(`\\b${escapedParkName}\\b`, 'i');
      if (parkName.length > 3 && (parkNameRegex.test(postContent) || parkNameRegex.test(postExcerpt))) {
        score += 15;
      }

      // Score for business type keywords
      const businessKeywords = ['indoor dog park', 'training', 'agility', 'daycare', 'boarding'];
      businessKeywords.forEach((keyword) => {
        if (
          park.businessType.toLowerCase().includes(keyword) &&
          (postContent.includes(keyword) || postTitle.includes(keyword))
        ) {
          score += 5;
        }
      });

      // Score for category/tag matches
      blogPost.categories.forEach((cat) => {
        const catName = cat.name.toLowerCase();
        if (catName.includes('training') && park.businessType.toLowerCase().includes('training')) {
          score += 3;
        }
        if (catName.includes('indoor') && park.businessType.toLowerCase().includes('indoor')) {
          score += 3;
        }
      });

      return { park, score };
    });

    // Sort by score and return top results
    return scoredParks
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.park);
  } catch (error) {
    console.error('Error fetching related parks:', error);
    return [];
  }
}

/**
 * Get related categories based on shared tags or similar names
 */
export async function getRelatedCategories(
  category: WPCategory,
  limit: number = 4
): Promise<WPCategory[]> {
  try {
    const allCategories = await getCachedCategories();
    const categoryName = category.name.toLowerCase();

    // Score categories based on name similarity
    const scoredCategories = allCategories
      .filter((cat: any) => cat.id !== category.id)
      .map((cat: any) => {
        let score = 0;
        const catName = cat.name.toLowerCase();

        // Check for common words
        const commonWords = ['dog', 'park', 'training', 'care', 'indoor', 'outdoor'];
        commonWords.forEach((word) => {
          if (categoryName.includes(word) && catName.includes(word)) {
            score += 2;
          }
        });

        return { category: cat, score };
      });

    return scoredCategories
      .filter((item: any) => item.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, limit)
      .map((item: any) => item.category);
  } catch (error) {
    console.error('Error fetching related categories:', error);
    return [];
  }
}

/**
 * Get related tags based on name similarity or co-occurrence
 */
export async function getRelatedTags(tag: WPTag, limit: number = 4): Promise<WPTag[]> {
  try {
    const allTags = await getCachedTags();
    const tagName = tag.name.toLowerCase();

    // Score tags based on name similarity
    const scoredTags = allTags
      .filter((t: any) => t.id !== tag.id)
      .map((t: any) => {
        let score = 0;
        const tName = t.name.toLowerCase();

        // Check for common words
        const commonWords = ['dog', 'park', 'training', 'care', 'indoor', 'outdoor', 'puppy', 'adult'];
        commonWords.forEach((word) => {
          if (tagName.includes(word) && tName.includes(word)) {
            score += 2;
          }
        });

        // Bonus for exact substring match
        if (tagName.length > 3 && tName.includes(tagName)) {
          score += 3;
        }
        if (tName.length > 3 && tagName.includes(tName)) {
          score += 3;
        }

        return { tag: t, score };
      });

    return scoredTags
      .filter((item: any) => item.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, limit)
      .map((item: any) => item.tag);
  } catch (error) {
    console.error('Error fetching related tags:', error);
    return [];
  }
}

/**
 * Extract city names mentioned in blog post content, scored and ranked by relevance
 */
export function extractMentionedCities(blogPost: BlogPost, allParks: DogPark[]): string[] {
  const postTitle = (blogPost.title || '').toLowerCase();
  const postSlug = (blogPost.slug || '').toLowerCase();
  const postExcerpt = (blogPost.excerpt || '').toLowerCase();
  const postContent = (blogPost.content || '').toLowerCase();

  // Deduplicate cities across parks
  const uniqueCities = new Map<string, string>();
  allParks.forEach((park) => {
    if (park.city && park.city.trim().length >= 3) {
      const lower = park.city.trim().toLowerCase();
      if (!uniqueCities.has(lower)) {
        uniqueCities.set(lower, park.city.trim());
      }
    }
  });

  const scoredCities: Array<{ cityName: string; score: number }> = [];

  uniqueCities.forEach((properCityName, lowerCityName) => {
    let score = 0;
    const escaped = lowerCityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRegex = new RegExp(`\\b${escaped}\\b`, 'i');
    const globalRegex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const slugKey = lowerCityName.replace(/\s+/g, '-');

    // Title & Slug matches get the absolute highest priority (focal subject of article)
    if (postSlug.includes(slugKey)) score += 1000;
    if (wordRegex.test(postTitle)) score += 300;
    if (wordRegex.test(postExcerpt)) score += 50;

    // Body text occurrences (exclude "Orange County" for city "Orange")
    let bodyMatches = (postContent.match(globalRegex) || []).length;
    if (lowerCityName === 'orange') {
      const countyMatches = (postContent.match(/\borange county\b/gi) || []).length;
      bodyMatches = Math.max(0, bodyMatches - countyMatches);
    }
    score += bodyMatches * 5;

    if (score > 0) {
      scoredCities.push({ cityName: properCityName, score });
    }
  });

  // Sort by score descending so the focal city is always at index 0
  return scoredCities
    .sort((a, b) => b.score - a.score)
    .map((item) => item.cityName);
}

