# SEO Testing Checklist - Quick Reference

## 🚀 Immediate Testing (After Deployment)

### 1. Basic Files (5 minutes)
- [ ] Visit `https://www.indoordogpark.org/robots.txt`
  - Should show rules for *, Googlebot, Bingbot
  - Should show sitemap URL
  - Should block /admin/, /api/, /studio/
  
- [ ] Visit `https://www.indoordogpark.org/sitemap.xml`
  - Should show XML with all pages
  - Should include parks, cities, blog posts
  - Should have proper priority values (0.0-1.0)
  - Should have lastModified dates

### 2. Metadata Verification (10 minutes)
- [ ] View homepage source (Ctrl+U / Cmd+Option+U)
  - Check `<title>` tag present
  - Check meta description present (155 chars or less)
  - Check canonical link present
  - Check Open Graph tags (og:title, og:description, og:image)
  - Check Twitter Card tags
  - Check JSON-LD scripts (Organization, Website schemas)

- [ ] View a park page source
  - Check unique title with park name
  - Check meta description
  - Check canonical URL
  - Check LocalBusiness/Park JSON-LD schema
  - Check breadcrumb navigation

- [ ] View a blog post source
  - Check unique title
  - Check meta description
  - Check canonical URL
  - Check social media tags

### 3. Google Tools Testing (15 minutes)

#### Rich Results Test
1. Go to: https://search.google.com/test/rich-results
2. Test homepage URL
   - Should detect: Organization, Website schemas
3. Test a park page URL (e.g., `/parks/park-slug`)
   - Should detect: LocalBusiness or Park schema
   - Should show: Name, Address, Rating, Hours
4. Screenshot any errors for fixing

#### Mobile-Friendly Test
1. Go to: https://search.google.com/test/mobile-friendly
2. Test homepage
3. Test a park page
4. Test a blog post
5. All should pass ✅

#### PageSpeed Insights
1. Go to: https://pagespeed.web.dev/
2. Test homepage
   - Target: 90+ on mobile, 95+ on desktop
   - Check Core Web Vitals: LCP, FID, CLS
3. Test a park page with images
4. Note any issues to fix

### 4. Security Headers (5 minutes)
1. Go to: https://securityheaders.com/
2. Enter: `https://www.indoordogpark.org`
3. Should see:
   - ✅ Strict-Transport-Security
   - ✅ X-Content-Type-Options
   - ✅ X-Frame-Options
   - ✅ Referrer-Policy
4. Target grade: A or A+

### 5. Social Media Preview (5 minutes)

#### Open Graph
1. Go to: https://www.opengraph.xyz/
2. Enter homepage URL
3. Verify:
   - Correct title displays
   - Correct description displays
   - Image displays (1200x630)
   - Type shows "website"

#### Twitter Card
1. Go to: https://cards-dev.twitter.com/validator
2. Enter homepage URL
3. Verify card displays correctly

---

## 📊 Setup Tasks (30 minutes)

### Google Search Console
1. Go to: https://search.google.com/search-console
2. Add property: `www.indoordogpark.org`
3. Verify ownership (DNS or HTML tag method)
4. Copy verification code
5. Add to `src/app/layout.tsx`:
   ```typescript
   verification: {
     google: 'paste-your-code-here',
   }
   ```
6. Submit sitemap: `https://www.indoordogpark.org/sitemap.xml`

### Bing Webmaster Tools
1. Go to: https://www.bing.com/webmasters
2. Add site: `www.indoordogpark.org`
3. Verify ownership
4. Copy verification code
5. Add to `src/app/layout.tsx`:
   ```typescript
   verification: {
     google: 'existing-code',
     bing: 'paste-your-code-here',
   }
   ```
6. Submit sitemap

### Google Analytics 4 (Optional but Recommended)
1. Go to: https://analytics.google.com/
2. Create new GA4 property
3. Copy Measurement ID (G-XXXXXXXXXX)
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
5. Implement tracking code

---

## 🔍 Weekly Monitoring Checklist

### Google Search Console (Mondays)
- [ ] Check Coverage report
  - No errors
  - All important pages indexed
- [ ] Check Performance report
  - Total clicks trending up
  - Average position improving
  - Identify top queries
- [ ] Check Mobile Usability
  - No mobile issues
- [ ] Check Core Web Vitals
  - All "Good" status

### Site Health Check
- [ ] Run broken link checker: https://www.brokenlinkcheck.com/
- [ ] Check for 404 errors in Analytics
- [ ] Verify all images loading correctly
- [ ] Test search functionality
- [ ] Verify forms working (contact, list-property)

---

## 🎯 Monthly SEO Tasks

### Content Audit
- [ ] Review top 10 performing pages
- [ ] Identify underperforming pages
- [ ] Update old blog posts with new information
- [ ] Add new blog content (2-4 posts/month)
- [ ] Check for keyword opportunities

### Technical Audit
- [ ] Review sitemap - all pages present?
- [ ] Check robots.txt - any needed changes?
- [ ] Review page speed scores
- [ ] Check for JavaScript errors in console
- [ ] Verify structured data still valid

### Competitor Analysis
- [ ] Check competitor rankings for key terms
- [ ] Analyze their content strategy
- [ ] Look for backlink opportunities
- [ ] Identify content gaps

---

## 📈 Quarterly SEO Review

### Comprehensive Audit
- [ ] Run full technical SEO audit (Screaming Frog or similar)
- [ ] Review all metadata and titles
- [ ] Check all structured data implementations
- [ ] Analyze conversion funnel
- [ ] Review internal linking strategy

### Performance Review
- [ ] Compare quarter-over-quarter metrics
  - Organic traffic
  - Keyword rankings
  - Click-through rates
  - Bounce rates
  - Conversions
- [ ] Set goals for next quarter
- [ ] Identify areas for improvement

### Content Strategy Update
- [ ] Review content calendar
- [ ] Identify trending topics in pet/dog space
- [ ] Plan seasonal content (summer activities, winter indoor play)
- [ ] Update outdated information

---

## 🛠 Tools Reference

### Free Tools
- **Google Search Console**: Monitor search performance
- **Google PageSpeed Insights**: Test speed
- **Google Rich Results Test**: Validate structured data
- **Mobile-Friendly Test**: Check mobile optimization
- **Security Headers**: Test security headers
- **SSL Labs**: Test HTTPS implementation
- **GTmetrix**: Additional speed testing

### Paid Tools (Optional)
- **Ahrefs**: Comprehensive SEO analysis, backlinks
- **SEMrush**: Keyword research, competitor analysis
- **Screaming Frog**: Technical SEO crawler
- **Moz Pro**: All-in-one SEO toolkit

---

## ⚠️ Common Issues & Fixes

### Issue: Sitemap not updating
**Fix**: 
```bash
# Force revalidation
curl -X POST 'https://www.indoordogpark.org/api/revalidate?path=/sitemap.xml'
```

### Issue: Pages not indexing
**Fix**: 
1. Check robots.txt not blocking
2. Verify canonical tags correct
3. Submit URL in Search Console
4. Check for noindex meta tags

### Issue: Low page speed scores
**Fix**:
1. Check image sizes (use Next.js Image)
2. Review third-party scripts
3. Enable caching headers
4. Consider CDN

### Issue: Structured data errors
**Fix**:
1. Test in Rich Results Test
2. Verify required fields present
3. Check date formats (ISO 8601)
4. Ensure URLs are absolute

---

## ✅ Pre-Launch Final Check

Before going live or after major updates:

- [ ] All meta tags in place
- [ ] Sitemap generated and accessible
- [ ] Robots.txt configured correctly
- [ ] Canonical URLs set on all pages
- [ ] All images have alt text
- [ ] 404 page exists and is helpful
- [ ] HTTPS working with valid certificate
- [ ] No mixed content warnings
- [ ] All structured data valid
- [ ] Mobile responsive on all pages
- [ ] Page speed scores acceptable (85+)
- [ ] Social media previews working
- [ ] Analytics tracking implemented
- [ ] Search Console verified
- [ ] Security headers configured

---

## 📞 Need Help?

If you encounter issues:

1. **Check documentation**: See SEO_BEST_PRACTICES_COMPLETE.md
2. **Test URLs**: Use Google's testing tools
3. **Review console logs**: Check browser dev tools
4. **Verify configuration**: Double-check next.config.js
5. **Check environment**: Ensure production build

---

## 📝 Notes

- Most SEO changes take 2-4 weeks to show results
- Keep testing and iterating
- Content quality > technical perfection
- User experience impacts SEO
- Mobile-first is crucial

**Last Updated**: November 14, 2025
**Next Review**: December 14, 2025

