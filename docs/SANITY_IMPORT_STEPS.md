# Step-by-Step: Adding NYC Blog Post to Sanity

## Quick Answer
**No, don't copy-paste the entire markdown file.** Follow these steps instead:

## Method 1: Manual Entry (Recommended for First Time)

### Step 1: Create the Blog Post
1. Open Sanity Studio (`npm run dev` → go to `/studio`)
2. Click **"Create new"** → **"Blog Post"**
3. Fill in:
   - **Title**: `Best Indoor Dog Parks in New York City: 2025 Guide to the Top Spots`
   - **Slug**: `best-indoor-dog-parks-new-york-city` (auto-generates)
   - **Excerpt**: `Discover the top indoor dog parks in NYC. From Financial District to Brooklyn, find climate-controlled play spaces for your pup year-round.`
   - **Author**: Select or create one
   - **Published At**: Current date/time

### Step 2: Add Categories & Tags
**Categories** (create if needed):
- Indoor Dog Parks
- New York City  
- Dog Parks

**Tags**:
- indoor dog parks
- new york city
- nyc dog parks
- manhattan
- brooklyn
- dog daycare

### Step 3: Add Content - Text Portions
Copy text sections from the markdown file and paste into Sanity as **regular text blocks**:

1. **Introduction paragraph** (lines 3-5)
2. **"How We Chose" section** (lines 9-16)
3. **Each facility review** (sections 1-10)
4. **"Tips for Choosing" section** (lines 371-397)
5. **"Final Thoughts" section** (lines 401-405)

**For headings**: Use H2, H3 styles in Sanity editor
**For bold text**: Use the bold button
**For lists**: Use bullet or numbered lists

### Step 4: Add SVG Charts - Use HTML Blocks

For each of the 4 charts, do this:

1. Click **"Add block"** in Sanity editor
2. Select **"HTML Block"** (this is the new type I added)
3. Copy the ENTIRE `<div>` section from the markdown file:

**Chart 1 - Distribution by Borough** (lines 172-206):
```html
<div style="width: 100%; max-width: 600px; margin: 2rem auto;">
<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="300" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">Indoor Dog Parks by Borough</text>
  
  <!-- Bars -->
  <rect x="50" y="80" width="80" height="240" fill="#8B5CF6" rx="4"/>
  <text x="90" y="340" text-anchor="middle" font-size="14" fill="#333">Manhattan</text>
  <text x="90" y="60" text-anchor="middle" font-size="16" font-weight="bold" fill="#8B5CF6">7</text>
  
  <rect x="180" y="160" width="80" height="160" fill="#EC4899" rx="4"/>
  <text x="220" y="340" text-anchor="middle" font-size="14" fill="#333">Brooklyn</text>
  <text x="220" y="140" text-anchor="middle" font-size="16" font-weight="bold" fill="#EC4899">3</text>
  
  <rect x="310" y="300" width="80" height="100" fill="#10B981" rx="4"/>
  <text x="350" y="340" text-anchor="middle" font-size="14" fill="#333">Staten Island</text>
  <text x="350" y="280" text-anchor="middle" font-size="16" font-weight="bold" fill="#10B981">1</text>
  
  <rect x="440" y="320" width="80" height="80" fill="#F59E0B" rx="4"/>
  <text x="480" y="340" text-anchor="middle" font-size="14" fill="#333">Queens</text>
  <text x="480" y="300" text-anchor="middle" font-size="16" font-weight="bold" fill="#F59E0B">0</text>
  
  <rect x="570" y="320" width="80" height="80" fill="#EF4444" rx="4"/>
  <text x="610" y="340" text-anchor="middle" font-size="14" fill="#333">Bronx</text>
  <text x="610" y="300" text-anchor="middle" font-size="16" font-weight="bold" fill="#EF4444">0</text>
  
  <!-- Y-axis -->
  <line x1="40" y1="50" x2="40" y2="330" stroke="#666" stroke-width="2"/>
  <text x="35" y="55" text-anchor="end" font-size="12" fill="#666">8</text>
  <text x="35" y="105" text-anchor="end" font-size="12" fill="#666">6</text>
  <text x="35" y="155" text-anchor="end" font-size="12" fill="#666">4</text>
  <text x="35" y="205" text-anchor="end" font-size="12" fill="#666">2</text>
  <text x="35" y="330" text-anchor="end" font-size="12" fill="#666">0</text>
</svg>
</div>
```

**Chart 2 - Venn Diagram** (lines 212-243):
```html
<div style="width: 100%; max-width: 600px; margin: 2rem auto;">
<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="300" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">Service Overlap at NYC Indoor Dog Parks</text>
  
  <!-- Three overlapping circles for Venn diagram -->
  <!-- Daycare circle (left) -->
  <circle cx="200" cy="200" r="100" fill="#8B5CF6" opacity="0.6" stroke="#8B5CF6" stroke-width="2"/>
  <text x="200" y="90" text-anchor="middle" font-size="14" font-weight="bold" fill="#8B5CF6">Daycare</text>
  
  <!-- Grooming circle (right) -->
  <circle cx="400" cy="200" r="100" fill="#EC4899" opacity="0.6" stroke="#EC4899" stroke-width="2"/>
  <text x="400" y="90" text-anchor="middle" font-size="14" font-weight="bold" fill="#EC4899">Grooming</text>
  
  <!-- Boarding circle (bottom) -->
  <circle cx="300" cy="280" r="100" fill="#10B981" opacity="0.6" stroke="#10B981" stroke-width="2"/>
  <text x="300" y="380" text-anchor="middle" font-size="14" font-weight="bold" fill="#10B981">Boarding</text>
  
  <!-- Overlap labels -->
  <text x="250" y="240" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">Daycare +</text>
  <text x="250" y="255" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">Grooming</text>
  
  <text x="350" y="240" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">Grooming +</text>
  <text x="350" y="255" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">Boarding</text>
  
  <text x="200" y="300" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">Daycare +</text>
  <text x="200" y="315" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">Boarding</text>
  
  <text x="300" y="200" text-anchor="middle" font-size="11" font-weight="bold" fill="#fff">All Three</text>
  <text x="300" y="215" text-anchor="middle" font-size="11" font-weight="bold" fill="#fff">Services</text>
</svg>
</div>
```

**Chart 3 - Price Range** (lines 249-282):
```html
<div style="width: 100%; max-width: 600px; margin: 2rem auto;">
<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="300" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">Average Daily Rates by Service Type</text>
  
  <!-- Horizontal bars -->
  <!-- Daycare -->
  <rect x="100" y="80" width="200" height="40" fill="#8B5CF6" rx="4"/>
  <text x="110" y="105" font-size="14" fill="#fff">Daycare: $40-65/day</text>
  
  <!-- Boarding -->
  <rect x="100" y="140" width="280" height="40" fill="#EC4899" rx="4"/>
  <text x="110" y="165" font-size="14" fill="#fff">Boarding: $60-90/night</text>
  
  <!-- Grooming -->
  <rect x="100" y="200" width="150" height="40" fill="#10B981" rx="4"/>
  <text x="110" y="225" font-size="14" fill="#fff">Grooming: $50-100</text>
  
  <!-- Training -->
  <rect x="100" y="260" width="180" height="40" fill="#F59E0B" rx="4"/>
  <text x="110" y="285" font-size="14" fill="#fff">Training: $80-150/session</text>
  
  <!-- X-axis scale -->
  <line x1="100" y1="320" x2="500" y2="320" stroke="#666" stroke-width="2"/>
  <text x="100" y="340" text-anchor="middle" font-size="12" fill="#666">$0</text>
  <text x="200" y="340" text-anchor="middle" font-size="12" fill="#666">$50</text>
  <text x="300" y="340" text-anchor="middle" font-size="12" fill="#666">$100</text>
  <text x="400" y="340" text-anchor="middle" font-size="12" fill="#666">$150</text>
  <text x="500" y="340" text-anchor="middle" font-size="12" fill="#666">$200</text>
  
  <!-- Note -->
  <text x="300" y="370" text-anchor="middle" font-size="11" fill="#666" font-style="italic">*Prices vary by location, dog size, and package deals</text>
</svg>
</div>
```

**Chart 4 - Amenities Comparison** (lines 288-365):
Copy the entire `<div>` from lines 288-365 in the markdown file.

4. Paste into the HTML Block field
5. Add the caption text that follows each chart as a regular text block

### Step 5: Add Featured Image
Upload an image (dogs playing indoors, NYC skyline, etc.) and add alt text.

### Step 6: Publish
Click **"Publish"** in Sanity Studio.

---

## Method 2: Alternative - Use HTML Directly (If HTML Block Doesn't Work)

If the HTML Block type doesn't appear in Sanity Studio:

1. **Restart your dev server** after the schema changes:
   ```bash
   npm run dev
   ```

2. **Or** convert SVG charts to images:
   - Open each SVG in a browser
   - Take screenshots
   - Upload as images in Sanity
   - Add captions

---

## Content Order in Sanity

1. Introduction
2. "How We Chose" section
3. Facility reviews (1-10)
4. "Data Insights" heading
5. Chart 1 (Borough distribution)
6. Chart 2 (Venn diagram)
7. Chart 3 (Price range)
8. Chart 4 (Amenities)
9. "Tips for Choosing" section
10. "Final Thoughts" section

---

## Troubleshooting

**Q: HTML Block type doesn't appear?**
- Restart Sanity Studio (`npm run dev`)
- Check that `sanity/schemas/post.ts` was saved correctly

**Q: Charts don't display?**
- Make sure you copied the ENTIRE `<div>` including the wrapper
- Check browser console for errors
- Verify the HTML renderer was updated in `src/lib/sanity-api.ts`

**Q: Content looks wrong?**
- Sanity uses Portable Text, so formatting might need adjustment
- Use Sanity's formatting buttons (bold, headings, lists)

---

## Quick Checklist

- [ ] Blog post created with correct slug
- [ ] Categories and tags added
- [ ] All text content added
- [ ] 4 HTML blocks with SVG charts added
- [ ] Featured image uploaded
- [ ] Published and verified at `/blog/best-indoor-dog-parks-new-york-city`

