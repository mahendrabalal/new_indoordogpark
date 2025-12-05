# Mobile Testing Checklist

## Device Testing

### iOS Devices
- [ ] iPhone SE (1st/2nd gen) - 320px width
- [ ] iPhone 8/SE - 375px width
- [ ] iPhone 8 Plus - 414px width
- [ ] iPhone X/XS/11 Pro - 375px width
- [ ] iPhone XR/11 - 414px width
- [ ] iPhone XS Max/11 Pro Max - 414px width
- [ ] iPhone 12/13 mini - 375px width
- [ ] iPhone 12/13 - 390px width
- [ ] iPhone 12/13 Pro Max - 428px width
- [ ] iPad Mini - 768px width
- [ ] iPad - 768px width
- [ ] iPad Pro 11" - 834px width
- [ ] iPad Pro 12.9" - 1024px width

### Android Devices
- [ ] Samsung Galaxy S21/S22 - 360px width
- [ ] Samsung Galaxy Note - 412px width
- [ ] Google Pixel 4/5 - 393px width
- [ ] Google Pixel 6/7 - 412px width
- [ ] OnePlus - Various sizes
- [ ] Android tablets - Various sizes

## Browser Testing

### iOS Browsers
- [ ] Safari iOS (latest)
- [ ] Chrome iOS (latest)
- [ ] Firefox iOS (latest)
- [ ] Edge iOS (latest)

### Android Browsers
- [ ] Chrome Android (latest)
- [ ] Samsung Internet (latest)
- [ ] Firefox Android (latest)
- [ ] Edge Android (latest)

## Screen Size Testing

### Breakpoints to Test
- [ ] 320px (smallest common mobile)
- [ ] 375px (iPhone standard)
- [ ] 390px (iPhone 12/13)
- [ ] 414px (iPhone Plus/Max)
- [ ] 428px (iPhone Pro Max)
- [ ] 768px (iPad portrait)
- [ ] 834px (iPad Pro 11")
- [ ] 1024px (iPad Pro 12.9"/desktop)

## Functionality Testing

### Navigation
- [ ] Hamburger menu opens/closes correctly
- [ ] Menu items are clickable
- [ ] Menu closes on item selection
- [ ] Menu closes on outside click
- [ ] Menu accessible via keyboard
- [ ] Menu accessible via screen reader
- [ ] Sticky header works correctly
- [ ] Header doesn't block content

### Search Functionality
- [ ] Search input is easily accessible
- [ ] Autocomplete dropdown appears
- [ ] Autocomplete items are selectable
- [ ] Search clears correctly
- [ ] Search results display properly
- [ ] Search works on all pages
- [ ] Keyboard shortcuts work (/ for focus)

### Map/List View
- [ ] Map/list toggle button is visible
- [ ] Toggle button is easily clickable (44px+)
- [ ] Switching between views works smoothly
- [ ] Map loads correctly
- [ ] Map markers are clickable
- [ ] List view scrolls smoothly
- [ ] No layout shifts during toggle

### Filters
- [ ] Filters are accessible
- [ ] Filter dropdowns work on mobile
- [ ] Filter selects are large enough (44px+)
- [ ] Clear filters button works
- [ ] Filters apply correctly
- [ ] Filter state persists

### Forms
- [ ] Contact form works correctly
- [ ] Input fields are properly sized
- [ ] Input types show correct keyboards (tel, email)
- [ ] Form validation works
- [ ] Error messages are visible
- [ ] Form submission works
- [ ] Autocomplete attributes work

### Touch Interactions
- [ ] All buttons are easily tappable (44px+)
- [ ] Links are easily tappable
- [ ] No accidental taps on adjacent elements
- [ ] Tap highlights work correctly
- [ ] Swipe gestures work (where applicable)
- [ ] Pinch-to-zoom works (where applicable)
- [ ] Long-press works (where applicable)

### Images
- [ ] Images load correctly
- [ ] Images are properly sized for mobile
- [ ] Lazy loading works
- [ ] Image placeholders display
- [ ] Images don't cause layout shifts
- [ ] Image optimization works (WebP/AVIF)
- [ ] Hero image loads quickly

### Performance
- [ ] Page loads quickly (< 3s on 3G)
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1
- [ ] No blocking resources
- [ ] Smooth scrolling
- [ ] No janky animations

### Accessibility
- [ ] Text is readable without zooming
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All interactive elements are keyboard accessible
- [ ] Screen reader compatibility (VoiceOver/TalkBack)
- [ ] Focus indicators are visible
- [ ] ARIA labels are present
- [ ] Semantic HTML used correctly

### Scrolling & Layout
- [ ] No horizontal scrolling
- [ ] Vertical scrolling is smooth
- [ ] Fixed elements don't block content
- [ ] Sticky elements work correctly
- [ ] Infinite scroll/pagination works
- [ ] Back to top button works (if present)
- [ ] No layout shifts during scroll

## Page-Specific Testing

### Homepage
- [ ] Hero section displays correctly
- [ ] Search bar is prominent
- [ ] Quick links are clickable
- [ ] Featured parks display
- [ ] Park cards are properly sized
- [ ] Cities section displays
- [ ] Footer is accessible

### Park Detail Pages
- [ ] Park information displays correctly
- [ ] Images load properly
- [ ] Map displays correctly
- [ ] Directions work
- [ ] Contact information is clickable (tel: links)
- [ ] Hours display correctly
- [ ] Reviews section works

### City Pages
- [ ] City overview displays
- [ ] Park listings work
- [ ] Filters work correctly
- [ ] Map displays parks
- [ ] Statistics are visible

### Blog Pages
- [ ] Blog posts are readable
- [ ] Images in posts load
- [ ] Typography is appropriate
- [ ] Links work correctly
- [ ] Related posts display
- [ ] Table of contents works (if present)

### Search Results
- [ ] Results display correctly
- [ ] Map/list toggle works
- [ ] Filters work
- [ ] Pagination works
- [ ] No results message displays
- [ ] Loading states work

## PWA Testing

- [ ] Manifest.json is valid
- [ ] App can be installed
- [ ] Icons display correctly
- [ ] Theme color applies
- [ ] Splash screen works
- [ ] Offline functionality (if implemented)
- [ ] Service worker works (if implemented)
- [ ] Update prompts work (if applicable)

## Performance Metrics

### Lighthouse Scores (Target: 90+)
- [ ] Performance: ___
- [ ] Accessibility: ___
- [ ] Best Practices: ___
- [ ] SEO: ___

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint): ___ (Target: < 2.5s)
- [ ] FID (First Input Delay): ___ (Target: < 100ms)
- [ ] CLS (Cumulative Layout Shift): ___ (Target: < 0.1)

### Network Conditions
- [ ] 3G (Slow): Page loads and works
- [ ] 4G (Fast): Page loads quickly
- [ ] WiFi: Optimal performance
- [ ] Offline: Graceful degradation

## Edge Cases

- [ ] Very long park names don't break layout
- [ ] Very long addresses display correctly
- [ ] Missing images show fallbacks
- [ ] Network errors handled gracefully
- [ ] Form errors display correctly
- [ ] Empty states display properly
- [ ] Loading states are clear
- [ ] Error messages are helpful

## Browser-Specific Issues

### Safari iOS
- [ ] Viewport height issues (100vh)
- [ ] Sticky position works
- [ ] Form inputs don't zoom on focus
- [ ] Fixed elements work correctly

### Chrome Android
- [ ] Address bar behavior
- [ ] Pull-to-refresh (if implemented)
- [ ] Form inputs work correctly

### Samsung Internet
- [ ] Rendering is correct
- [ ] Performance is acceptable
- [ ] All features work

## Notes Section

Use this space to document any issues found:

### Issues Found:
1. 
2. 
3. 

### Device-Specific Issues:
- **Device:** ___
- **Browser:** ___
- **Issue:** ___

### Performance Issues:
- **Metric:** ___
- **Value:** ___
- **Target:** ___
- **Action:** ___










