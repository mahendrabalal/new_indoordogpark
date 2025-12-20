# SEO Implementation Checklist

Use this checklist when creating new pages or components to ensure SEO best practices are followed.

## ✅ Pre-Development Checklist

### Planning
- [ ] Identify target keywords for the page
- [ ] Research competitor pages
- [ ] Plan internal linking strategy
- [ ] Determine appropriate schema markup

---

## ✅ Page-Level SEO Checklist

### Metadata
- [ ] Unique title tag (60 characters max)
  - [ ] Includes primary keyword
  - [ ] Includes location (if applicable)
  - [ ] Includes brand name
- [ ] Unique meta description (120-155 characters)
  - [ ] Includes primary keyword naturally
  - [ ] Includes call-to-action or value proposition
  - [ ] Compelling and click-worthy
- [ ] Canonical URL (absolute, not relative)
- [ ] Open Graph tags
  - [ ] `og:title`
  - [ ] `og:description`
  - [ ] `og:type` (website/article)
  - [ ] `og:url` (absolute)
  - [ ] `og:image` (1200x630px)
- [ ] Twitter Card tags
  - [ ] `twitter:card` (summary_large_image)
  - [ ] `twitter:title`
  - [ ] `twitter:description`
  - [ ] `twitter:image`

### Structured Data
- [ ] Appropriate schema type selected
- [ ] All required fields populated
- [ ] Schema validated with Google Rich Results Test
- [ ] No undefined/null values in schema
- [ ] BreadcrumbList schema (if applicable)

### Content
- [ ] One H1 tag per page
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Keywords used naturally (1-2% density)
- [ ] Unique content (no duplicate content)
- [ ] Content provides value to users
- [ ] Internal links with descriptive anchor text

### Images
- [ ] All images have descriptive alt text
- [ ] No generic alt text ("image", "photo", etc.)
- [ ] Images optimized (WebP format, compressed)
- [ ] Lazy loading for below-the-fold images
- [ ] Priority loading for hero images
- [ ] Images included in structured data (if relevant)

### URLs
- [ ] URL is lowercase
- [ ] Uses hyphens, not underscores
- [ ] Includes relevant keywords
- [ ] No trailing slash
- [ ] Under 75 characters (when possible)

---

## ✅ Component-Level SEO Checklist

### Links
- [ ] Descriptive anchor text (not "click here")
- [ ] External links have `rel="noopener noreferrer"`
- [ ] Internal links use Next.js `Link` component
- [ ] Links are accessible (keyboard navigable)

### Images
- [ ] `alt` attribute present
- [ ] `width` and `height` specified (prevents CLS)
- [ ] Appropriate `loading` attribute (lazy/eager)
- [ ] `fetchPriority` for above-the-fold images

### Headings
- [ ] Semantic HTML (`<h1>`, `<h2>`, etc.)
- [ ] Proper hierarchy maintained
- [ ] Keywords included naturally

---

## ✅ Technical SEO Checklist

### Performance
- [ ] Page loads in < 3 seconds
- [ ] LCP < 2.5 seconds
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Images optimized and compressed
- [ ] CSS/JS minified
- [ ] Critical CSS inlined

### Mobile
- [ ] Responsive design
- [ ] Mobile-friendly (Google Mobile-Friendly Test)
- [ ] Touch targets ≥ 44x44px
- [ ] Readable text (≥16px)
- [ ] No horizontal scrolling

### Accessibility
- [ ] Semantic HTML5 elements
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Color contrast WCAG AA (4.5:1)
- [ ] Screen reader friendly

---

## ✅ Post-Development Checklist

### Testing
- [ ] Test with Google Rich Results Test
- [ ] Validate schema with Schema.org Validator
- [ ] Check mobile-friendliness
- [ ] Test page speed (PageSpeed Insights)
- [ ] Verify canonical URL is absolute
- [ ] Check Open Graph tags (opengraph.xyz)
- [ ] Test with screen reader
- [ ] Verify keyboard navigation

### Monitoring
- [ ] Submit to Google Search Console
- [ ] Monitor Core Web Vitals
- [ ] Track search rankings
- [ ] Monitor click-through rates
- [ ] Check for broken links

---

## ✅ Maintenance Checklist

### Regular Audits (Monthly)
- [ ] Check for broken links
- [ ] Verify all images have alt text
- [ ] Check for duplicate content
- [ ] Review search rankings
- [ ] Update stale content

### Quarterly Reviews
- [ ] Full SEO audit
- [ ] Schema validation
- [ ] Performance review
- [ ] Content freshness check
- [ ] Competitor analysis

---

## 🚨 Common SEO Mistakes to Avoid

- ❌ **Duplicate titles/descriptions** - Every page must be unique
- ❌ **Missing alt text** - Every image needs descriptive alt text
- ❌ **Generic anchor text** - Use descriptive text, not "click here"
- ❌ **Relative canonical URLs** - Always use absolute URLs
- ❌ **Missing structured data** - Use appropriate schemas
- ❌ **Keyword stuffing** - Use keywords naturally
- ❌ **Thin content** - Provide valuable, comprehensive content
- ❌ **Slow pages** - Optimize images and code
- ❌ **Poor mobile experience** - Test on mobile devices
- ❌ **Broken links** - Regularly check for 404s

---

## 📝 Quick Reference

### Title Tag Format
```
Primary Keyword | Secondary Keyword | Brand Name
Example: Best Indoor Dog Parks in Los Angeles | Indoor Dog Park
```

### Meta Description Format
```
[Value Proposition] [Primary Keyword] [Location]. [Call-to-Action]
Example: Discover 25+ indoor dog parks in Los Angeles. Climate-controlled play spaces and training facilities. Search by neighborhood.
```

### URL Format
```
/lowercase-with-hyphens-keywords
Example: /parks/glen-alla-dog-park-marina-del-rey
```

### Image Alt Text Format
```
[What it is] [Where it is] [Key details]
Example: Glen Alla Dog Park entrance with fenced play area in Marina Del Rey
```

---

**Last Updated:** January 2025  
**Use this checklist for:** All new pages, components, and content updates






























