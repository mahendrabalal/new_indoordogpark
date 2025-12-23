# SEO Best Practices Guide - Indoor Dog Park

This document outlines SEO best practices that should be followed for all development work on this project.

## 📋 Table of Contents

1. [Metadata Standards](#metadata-standards)
2. [Structured Data](#structured-data)
3. [URL Structure](#url-structure)
4. [Image Optimization](#image-optimization)
5. [Internal Linking](#internal-linking)
6. [Content Optimization](#content-optimization)
7. [Technical SEO](#technical-seo)
8. [Performance SEO](#performance-seo)
9. [Mobile SEO](#mobile-seo)
10. [Accessibility & SEO](#accessibility--seo)

---

## 1. Metadata Standards

### Title Tags
- **Length:** Maximum 60 characters (including brand name)
- **Format:** `Primary Keyword | Secondary Keyword | Brand Name`
- **Best Practice:** Include location, service type, and brand
- **Example:** `Best Indoor Dog Parks in Los Angeles | Indoor Dog Park`

### Meta Descriptions
- **Length:** 150-160 characters (optimal: 155)
- **Format:** Include primary keyword, value proposition, and call-to-action
- **Best Practice:** Write unique descriptions for every page
- **Example:** `Discover 25+ indoor dog parks in Los Angeles. Climate-controlled play spaces, training facilities, and dog-friendly establishments. Search by neighborhood.`

### Canonical URLs
- **Always use absolute URLs:** `${siteUrl}/path/to/page`
- **Never use relative URLs:** `/path/to/page` ❌
- **One canonical per page:** Always specify canonical URL
- **Implementation:** Use `alternates.canonical` in Next.js metadata

### Open Graph Tags
- **Required fields:** `title`, `description`, `type`, `url`, `image`
- **Image size:** 1200x630px (1.91:1 ratio)
- **Type:** `website` for pages, `article` for blog posts
- **Locale:** `en_US` for US English content

### Twitter Cards
- **Card type:** `summary_large_image` for visual content
- **Image size:** 1200x630px minimum
- **Required:** `title`, `description`, `image`, `site`, `creator`

---

## 2. Structured Data

### Required Schemas

#### Organization Schema
- **Location:** Root layout (`src/app/layout.tsx`)
- **Required fields:** `name`, `url`, `logo`
- **Optional:** `sameAs` (social media), `contactPoint`

#### WebSite Schema
- **Location:** Root layout
- **Required:** `name`, `url`, `potentialAction` (SearchAction)

#### LocalBusiness/SportsActivityLocation Schema
- **Location:** Park detail pages
- **Required:** `name`, `address`, `geo`, `url`
- **Optional:** `openingHours`, `aggregateRating`, `priceRange`, `image`

#### BreadcrumbList Schema
- **Location:** All content pages
- **Required:** `itemListElement` with proper hierarchy
- **Best Practice:** Home → Category → Page

#### BlogPosting Schema
- **Location:** Blog post pages
- **Required:** `headline`, `datePublished`, `author`, `publisher`
- **Optional:** `dateModified`, `image`, `wordCount`, `timeRequired`

#### FAQPage Schema
- **Location:** Pages with FAQs
- **Required:** `mainEntity` with `Question` and `Answer` objects
- **Best Practice:** Limit to 10 most relevant FAQs

### Schema Validation
- Always validate with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Use [Schema.org Validator](https://validator.schema.org/)
- Remove undefined/null values before output

---

## 3. URL Structure

### Best Practices
- **Use hyphens, not underscores:** `dog-park-los-angeles` ✅, `dog_park_los_angeles` ❌
- **Lowercase only:** All URLs should be lowercase
- **Keep URLs short:** Maximum 75 characters when possible
- **Include keywords:** Use relevant keywords in URLs
- **No trailing slashes:** Use `next.config.js` to enforce
- **Avoid query parameters:** Use clean URLs instead

### URL Patterns
```
✅ Good:
/parks/glen-alla-dog-park
/cities/los-angeles
/blog/indoor-dog-parks-guide

❌ Bad:
/parks/glen_alla_dog_park
/cities/Los-Angeles
/blog?id=123
```

### Redirects
- **301 redirects:** For permanent URL changes
- **Canonical redirects:** Redirect to canonical slug if different
- **Trailing slash redirects:** Always redirect to non-trailing slash

---

## 4. Image Optimization

### Alt Text Requirements
- **Every image must have alt text**
- **Descriptive, not generic:** `"Glen Alla Dog Park entrance with fenced play area"` ✅, `"image"` ❌
- **Include keywords naturally:** Don't keyword stuff
- **Decorative images:** Use empty alt (`alt=""`) for decorative images only
- **Context-aware:** Alt text should describe the image in context

### Image Formats
- **Preferred:** WebP with AVIF fallback
- **Size:** Optimize for web (compress, resize)
- **Lazy loading:** Use for below-the-fold images
- **Priority loading:** For above-the-fold hero images

### Image Schema
- Include images in structured data when relevant
- Use `ImageObject` schema with `width` and `height`
- Provide multiple sizes for responsive images

---

## 5. Internal Linking

### Best Practices
- **Use descriptive anchor text:** `"Best indoor dog parks in Los Angeles"` ✅, `"click here"` ❌
- **Link to relevant content:** Related parks, cities, blog posts
- **Use proper heading hierarchy:** H1 → H2 → H3
- **Breadcrumb navigation:** Always include breadcrumbs
- **Related content sections:** Add "Related Parks" and "Related Articles"

### Link Structure
```tsx
// ✅ Good: Descriptive anchor text
<Link href="/parks/glen-alla-dog-park">
  Glen Alla Dog Park in Marina Del Rey
</Link>

// ❌ Bad: Generic anchor text
<Link href="/parks/glen-alla-dog-park">
  Click here
</Link>
```

### Internal Link Strategy
- **Homepage:** Link to top cities and featured parks
- **City pages:** Link to all parks in that city
- **Park pages:** Link to nearby parks and related blog posts
- **Blog posts:** Link to relevant parks and cities mentioned

---

## 6. Content Optimization

### Heading Structure
- **One H1 per page:** The main title
- **Logical hierarchy:** H1 → H2 → H3 (never skip levels)
- **Include keywords:** Naturally in headings
- **Descriptive headings:** Clear and specific

### Content Quality
- **Unique content:** No duplicate content across pages
- **Keyword density:** 1-2% (natural, not forced)
- **Readability:** Use short sentences and paragraphs
- **Value-first:** Provide useful information to users

### Content Length
- **Park descriptions:** 150-300 words minimum
- **Blog posts:** 1000+ words for comprehensive guides
- **City pages:** 200-500 words with local context

---

## 7. Technical SEO

### Robots.txt
- **Allow important content:** Parks, cities, blog posts
- **Block admin areas:** `/admin/`, `/api/`, `/studio/`
- **Reference sitemap:** Include sitemap URL
- **Block bad bots:** AhrefsBot, SemrushBot, etc.

### Sitemap
- **Sitemap index:** For sites with 500+ URLs
- **Separate sitemaps:** Static, parks, cities, blog
- **Update frequency:** Weekly for dynamic content
- **Priority values:** 0.3-1.0 (realistic, not all 1.0)

### XML Sitemap Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.indoordogpark.org/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://www.indoordogpark.org/sitemap-parks.xml</loc>
  </sitemap>
</sitemapindex>
```

### Security Headers
- **HSTS:** Strict-Transport-Security
- **X-Frame-Options:** SAMEORIGIN
- **X-Content-Type-Options:** nosniff
- **Referrer-Policy:** strict-origin-when-cross-origin

---

## 8. Performance SEO

### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5 seconds
- **FID (First Input Delay):** < 100 milliseconds
- **CLS (Cumulative Layout Shift):** < 0.1

### Optimization Strategies
- **Image optimization:** WebP, lazy loading, responsive sizes
- **Code splitting:** Lazy load components
- **Minification:** CSS, JavaScript
- **Caching:** Static assets with long cache times
- **CDN:** Use for static assets

### Page Speed
- **Target:** 90+ PageSpeed Insights score
- **Mobile-first:** Optimize for mobile devices
- **Critical CSS:** Inline critical CSS
- **Defer non-critical JS:** Load scripts asynchronously

---

## 9. Mobile SEO

### Mobile-First Indexing
- **Responsive design:** All pages must be mobile-friendly
- **Touch targets:** Minimum 44x44px
- **Readable text:** Minimum 16px font size
- **Viewport meta tag:** Required in all pages

### Mobile Optimization
- **Fast loading:** Optimize images for mobile
- **Simplified navigation:** Mobile menu
- **Thumb-friendly:** Important actions within thumb reach
- **No horizontal scrolling:** Responsive layout

---

## 10. Accessibility & SEO

### Semantic HTML
- **Use proper HTML5 elements:** `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- **ARIA labels:** For interactive elements
- **Skip links:** For keyboard navigation
- **Alt text:** For all images

### Accessibility Best Practices
- **Color contrast:** WCAG AA minimum (4.5:1)
- **Keyboard navigation:** All interactive elements accessible
- **Screen reader support:** Proper ARIA attributes
- **Focus indicators:** Visible focus states

---

## 🔧 Implementation Checklist

### For Every New Page
- [ ] Unique title tag (60 chars max)
- [ ] Unique meta description (155 chars)
- [ ] Canonical URL (absolute)
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] BreadcrumbList schema
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] All images have alt text
- [ ] Internal links with descriptive anchor text
- [ ] Mobile-responsive design

### For Park Pages
- [ ] LocalBusiness/SportsActivityLocation schema
- [ ] Review schema (if reviews exist)
- [ ] FAQ schema (if FAQs exist)
- [ ] Geo coordinates in schema
- [ ] Opening hours in schema
- [ ] Related parks section
- [ ] Related blog posts section

### For Blog Posts
- [ ] BlogPosting schema
- [ ] Author information
- [ ] Publication date
- [ ] Featured image with alt text
- [ ] Table of contents (for long posts)
- [ ] Related parks section
- [ ] Related articles section

### For City Pages
- [ ] CollectionPage or ItemList schema
- [ ] FAQ schema
- [ ] All parks in city linked
- [ ] Local landmarks mentioned
- [ ] Nearby cities linked

---

## 📊 Monitoring & Maintenance

### Regular Audits
- **Monthly:** Check for broken links, missing alt text
- **Quarterly:** Review search rankings, update content
- **Annually:** Full SEO audit, schema validation

### Tools
- **Google Search Console:** Monitor indexing, search performance
- **Google Analytics:** Track user behavior
- **PageSpeed Insights:** Monitor Core Web Vitals
- **Rich Results Test:** Validate structured data
- **Schema Validator:** Check schema markup

---

## 🚫 Common Mistakes to Avoid

1. **Duplicate content:** Don't copy-paste descriptions
2. **Keyword stuffing:** Use keywords naturally
3. **Missing alt text:** Every image needs alt text
4. **Broken links:** Regularly check for 404s
5. **Slow pages:** Optimize images and code
6. **Missing canonical:** Always specify canonical URL
7. **Poor mobile experience:** Test on mobile devices
8. **Thin content:** Provide valuable, comprehensive content
9. **Missing structured data:** Use appropriate schemas
10. **Ignoring Core Web Vitals:** Monitor and optimize

---

## 📚 Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/docs/documents.html)
- [Next.js SEO Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Web.dev SEO Guide](https://web.dev/learn-seo/)
- [Google Search Central](https://developers.google.com/search)

---

**Last Updated:** January 2025  
**Maintained By:** Development Team  
**Review Frequency:** Quarterly

































