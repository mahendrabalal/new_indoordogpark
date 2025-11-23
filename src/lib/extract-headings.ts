/**
 * Extract headings (h1-h6) from HTML content for table of contents
 */
export interface HeadingItem {
  id: string;
  title: string;
  level: number;
}

/**
 * Generate a URL-friendly ID from a heading text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extract headings from HTML content using regex (works server-side)
 */
export function extractHeadingsFromHtml(html: string): HeadingItem[] {
  if (!html) return [];

  const items: HeadingItem[] = [];
  const idCounter: Record<string, number> = {};

  // Match all heading tags (h1-h6) with their content
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const rawText = match[2];
    
    // Remove HTML tags from the heading text
    const text = rawText.replace(/<[^>]*>/g, '').trim();
    
    if (!text) continue;

    // Generate unique ID
    let baseId = slugify(text);
    if (idCounter[baseId]) {
      idCounter[baseId]++;
      baseId = `${baseId}-${idCounter[baseId]}`;
    } else {
      idCounter[baseId] = 1;
    }

    items.push({
      id: baseId,
      title: text,
      level,
    });
  }

  return items;
}

/**
 * Add IDs to headings in HTML content for anchor linking (server-side compatible)
 */
export function addIdsToHeadings(html: string): string {
  if (!html) return '';

  const idCounter: Record<string, number> = {};
  
  // Replace each heading with one that has an ID
  return html.replace(/<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/gi, (match, level, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    if (!text) return match;

    let baseId = slugify(text);
    if (idCounter[baseId]) {
      idCounter[baseId]++;
      baseId = `${baseId}-${idCounter[baseId]}`;
    } else {
      idCounter[baseId] = 1;
    }

    // Check if ID already exists in attributes
    if (attrs && attrs.includes('id=')) {
      return match; // Don't override existing IDs
    }

    return `<h${level}${attrs} id="${baseId}">${content}</h${level}>`;
  });
}

