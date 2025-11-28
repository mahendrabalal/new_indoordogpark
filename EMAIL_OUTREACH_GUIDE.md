# Email Outreach Guide for Indoor Dog Parks

This guide explains how to send promotional and monetization emails to indoor dog parks in your directory.

## Overview

The email outreach system allows you to:
- Send personalized emails to park owners about featured listing opportunities
- Track email delivery and responses
- Comply with email marketing best practices (CAN-SPAM)
- Scale outreach campaigns efficiently

## Prerequisites

### 1. Set Up Resend Account

1. Sign up for a free Resend account at [resend.com](https://resend.com)
2. Verify your domain (indoordogpark.org) or use Resend's test domain for development
3. Get your API key from the Resend dashboard

### 2. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=IndoorDogPark <outreach@indoordogpark.org>

# Optional: API token for protecting the outreach endpoint
OUTREACH_API_TOKEN=your-secure-random-token-here

# Base URL (for production)
NEXT_PUBLIC_BASE_URL=https://indoordogpark.org
```

### 3. Install Dependencies

```bash
npm install resend
```

## Email Templates

The system includes two email templates:

### 1. Initial Outreach Email
- Introduces your directory and partnership opportunity
- Highlights benefits of featured listings
- Includes call-to-action to upgrade
- Mentions special promotions

### 2. Follow-Up Email
- Shorter, more direct message
- Focuses on scheduling a call or quick upgrade
- Less formal tone

## Usage Methods

### Method 1: Using the API Endpoint (Recommended)

Send individual emails via the API:

```bash
curl -X POST http://localhost:3000/api/outreach/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "parkName": "Happy Paws Indoor Park",
    "parkEmail": "info@happypaws.com",
    "parkCity": "Los Angeles",
    "parkState": "California",
    "parkWebsite": "https://happypaws.com",
    "personalizedNote": "We noticed you have great reviews!",
    "testMode": false
  }'
```

### Method 2: Using the Bulk Script

Send emails to multiple parks from your JSON data files:

```bash
# Test mode - preview emails without sending
npx ts-node scripts/send-park-outreach.ts --test --limit 5

# Send to first 10 parks with email addresses
npx ts-node scripts/send-park-outreach.ts --limit 10

# Send only to indoor dog parks
npx ts-node scripts/send-park-outreach.ts --filter-type "Indoor Dog Park" --limit 20

# Use a different data file
npx ts-node scripts/send-park-outreach.ts --file public/data/washington.json --limit 15

# Custom delay between emails (default is 2000ms)
npx ts-node scripts/send-park-outreach.ts --delay 3000 --limit 10
```

### Method 3: Programmatic Usage

```typescript
import { sendEmail, generateParkOutreachEmail } from '@/lib/email';

const emailHtml = generateParkOutreachEmail({
  parkName: 'Happy Paws',
  parkEmail: 'info@happypaws.com',
  parkCity: 'Los Angeles',
  parkState: 'California',
  personalizedNote: 'We love your facility!',
});

await sendEmail({
  to: 'info@happypaws.com',
  subject: 'Partner with IndoorDogPark.org',
  html: emailHtml,
});
```

## Best Practices

### 1. Email Compliance (CAN-SPAM)

✅ **DO:**
- Include your physical mailing address in emails
- Provide clear unsubscribe instructions
- Use accurate "From" names and email addresses
- Honor unsubscribe requests promptly
- Include a clear subject line

❌ **DON'T:**
- Use misleading subject lines
- Send to purchased email lists
- Hide your identity
- Ignore unsubscribe requests

### 2. Personalization

- Use the park's actual name
- Reference their location (city/state)
- Mention specific details if available (reviews, amenities)
- Keep personalized notes brief and relevant

### 3. Timing

- Send during business hours (9 AM - 5 PM local time)
- Avoid weekends for B2B outreach
- Space out emails (2-3 second delay minimum)
- Consider time zones

### 4. Follow-Up Strategy

- Wait 5-7 days before sending follow-up
- Limit to 2-3 follow-ups maximum
- Track who has already been contacted
- Remove unsubscribed emails from future campaigns

### 5. Rate Limiting

The API includes rate limiting (10 emails per hour per IP). For bulk sending:
- Use the script with built-in delays
- Don't exceed 50-100 emails per day initially
- Monitor bounce rates and spam complaints
- Gradually increase volume as reputation improves

## Tracking and Analytics

### Email Metrics to Track

1. **Delivery Rate**: % of emails successfully delivered
2. **Open Rate**: % of emails opened (requires tracking pixels)
3. **Click Rate**: % of recipients who clicked links
4. **Conversion Rate**: % who upgraded to featured listing
5. **Bounce Rate**: % of emails that bounced
6. **Unsubscribe Rate**: % who unsubscribed

### Implementation

The script saves results to `outreach-results-{timestamp}.json`:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "results": [
    {
      "parkName": "Happy Paws",
      "email": "info@happypaws.com",
      "success": true,
      "emailId": "re_abc123"
    }
  ]
}
```

## Troubleshooting

### Issue: "RESEND_API_KEY is not configured"

**Solution**: Add `RESEND_API_KEY` to your `.env.local` file

### Issue: Emails going to spam

**Solutions**:
- Verify your domain with Resend
- Use a professional "From" address
- Avoid spam trigger words in subject lines
- Warm up your sending domain gradually
- Include unsubscribe links

### Issue: Rate limit errors

**Solutions**:
- Increase delay between emails (`--delay` flag)
- Reduce number of emails per batch (`--limit` flag)
- Spread campaigns across multiple days

### Issue: Invalid email addresses

**Solutions**:
- Validate emails before sending
- The script automatically skips parks without emails
- Check your data files for email format issues

## Advanced Features

### Custom Email Templates

Edit templates in `src/lib/email.ts`:
- `generateParkOutreachEmail()` - Initial outreach
- `generateFollowUpEmail()` - Follow-up message

### A/B Testing

Test different subject lines or content:
1. Create variant templates
2. Split your list 50/50
3. Track which performs better
4. Use winning variant for rest of campaign

### Integration with CRM

You can extend the system to:
- Log emails to your CRM/database
- Track opens and clicks
- Automate follow-ups based on engagement
- Sync with subscription status

## Sample Campaign Workflow

1. **Preparation** (Day 1)
   - Review park data for email addresses
   - Prepare personalized notes for top prospects
   - Test email template in test mode

2. **Initial Outreach** (Day 2)
   - Send to 20-30 parks (high priority)
   - Monitor delivery and responses
   - Track any immediate conversions

3. **Follow-Up** (Day 9)
   - Send follow-up to non-responders
   - Focus on parks that opened but didn't convert
   - Offer limited-time promotion

4. **Analysis** (Day 16)
   - Review conversion rates
   - Identify what worked/didn't work
   - Adjust messaging for next batch

## Legal Considerations

1. **CAN-SPAM Act Compliance**: Required for commercial emails in the US
2. **GDPR Compliance**: If sending to EU-based parks, ensure proper consent
3. **Unsubscribe Mechanism**: Must honor all unsubscribe requests
4. **Data Privacy**: Protect email addresses and don't share with third parties

## Support

For questions or issues:
- Check Resend dashboard for delivery logs
- Review server logs for API errors
- Test with `--test` mode first
- Start with small batches

## Next Steps

1. ✅ Set up Resend account and API key
2. ✅ Configure environment variables
3. ✅ Test with `--test` mode
4. ✅ Send to 5-10 parks as pilot
5. ✅ Monitor results and adjust
6. ✅ Scale up gradually

Good luck with your outreach campaign! 🚀

