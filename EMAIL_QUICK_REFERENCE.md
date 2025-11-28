# Email Outreach - Quick Reference

## ✅ System Status: READY

Your email outreach system is fully configured and tested!

## Quick Commands

```bash
# Test email API connection
npm run email:test

# Preview emails (test mode - no sending)
npm run outreach:test

# Create test parks with emails
npm run email:create-test

# Extract emails from park websites (requires Python)
npm run email:extract -- --limit 10

# Send real emails (when you have email addresses)
npm run outreach:send -- --limit 5
```

## Test Results

✅ **Email API**: Working  
✅ **Test Mode**: Working (100% success rate)  
✅ **Test Parks**: Created with sample emails  

## Current Situation

- ✅ Email system configured
- ✅ Resend API key added
- ✅ Templates ready
- ⚠️ **Real park data**: No email addresses yet

## Next Steps

### Option 1: Use Test Data (For Testing)
```bash
# Already created test parks
npm run outreach:test -- --file public/data/test-parks.json
```

### Option 2: Extract Emails from Websites
```bash
# Install Python dependencies first
pip install requests beautifulsoup4

# Extract emails from park websites
npm run email:extract -- --limit 20 --dry-run  # Preview
npm run email:extract -- --limit 20             # Actually save
```

### Option 3: Manual Collection
1. Visit park websites
2. Find contact emails
3. Add to JSON: `"email": "info@park.com"`

## When Ready to Send Real Emails

1. **Start dev server** (required for real sending):
   ```bash
   npm run dev
   ```

2. **In another terminal, send emails**:
   ```bash
   npm run outreach:send -- --limit 5
   ```

3. **Monitor results**:
   - Check `outreach-results-*.json` files
   - Check Resend dashboard for delivery status

## File Locations

- **Test parks**: `public/data/test-parks.json` (3 parks with emails)
- **Main data**: `public/data/california.json` (361 parks, no emails yet)
- **Results**: `outreach-results-*.json` (generated after each run)

## Email Template Features

- ✅ Professional design with gradient header
- ✅ Personalized with park name/location
- ✅ Clear value proposition
- ✅ Call-to-action buttons
- ✅ CAN-SPAM compliant
- ✅ Special promotion code (FIRST50)

## Troubleshooting

**"No parks found with email addresses"**
→ Your data doesn't have emails yet. Use test parks or extract emails.

**"Server returned non-JSON response"**
→ Dev server not running. Start with `npm run dev`

**"RESEND_API_KEY not found"**
→ Check `.env.local` file

## Documentation

- **Quick Start**: `EMAIL_OUTREACH_QUICKSTART.md`
- **Full Guide**: `EMAIL_OUTREACH_GUIDE.md`
- **Get Emails**: `HOW_TO_GET_PARK_EMAILS.md`
- **Setup Complete**: `EMAIL_SETUP_COMPLETE.md`

---

**Status**: 🟢 Ready to use!

