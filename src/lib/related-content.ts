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

    // Extract city names from post
    const cityKeywords: string[] = [];
    allParks.forEach((park) => {
      const cityName = park.city.toLowerCase();
      if (
        (postTitle.includes(cityName) || postContent.includes(cityName) || postExcerpt.includes(cityName)) &&
        !cityKeywords.includes(cityName)
      ) {
        cityKeywords.push(cityName);
      }
    });

    // Score parks based on relevance
    const scoredParks = allParks.map((park) => {
      let score = 0;
      const parkName = park.name.toLowerCase();
      const parkCity = park.city.toLowerCase();

      // High score for city match
      if (cityKeywords.includes(parkCity)) {
        score += 10;
      }

      // Score for name mentions
      if (postContent.includes(parkName) || postExcerpt.includes(parkName)) {
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
      .filter((cat) => cat.id !== category.id)
      .map((cat) => {
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
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.category);
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
      .filter((t) => t.id !== tag.id)
      .map((t) => {
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
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.tag);
  } catch (error) {
    console.error('Error fetching related tags:', error);
    return [];
  }
}

/**
 * Extract city names mentioned in blog post content
 */
export function extractMentionedCities(blogPost: BlogPost, allParks: DogPark[]): string[] {
  const cities: string[] = [];
  const content = (blogPost.content + ' ' + blogPost.title + ' ' + blogPost.excerpt).toLowerCase();

  allParks.forEach((park) => {
    const cityName = park.city.toLowerCase();
    if (content.includes(cityName) && !cities.includes(cityName)) {
      cities.push(cityName);
    }
  });

  return cities;
}

