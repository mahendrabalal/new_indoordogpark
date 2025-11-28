# Email Outreach Quick Start Guide

Get started sending promotional emails to indoor dog parks in 5 minutes!

## Step 1: Set Up Resend (2 minutes)

1. Go to [resend.com](https://resend.com) and sign up (free tier: 3,000 emails/month)
2. Verify your domain OR use Resend's test domain for development
3. Copy your API key from the dashboard

## Step 2: Configure Environment Variables (1 minute)

Add to your `.env.local` file:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=IndoorDogPark <outreach@indoordogpark.org>
```

**Optional** (for production):
```bash
OUTREACH_API_TOKEN=your-secure-random-token-here
NEXT_PUBLIC_BASE_URL=https://indoordogpark.org
```

## Step 3: Test It Out (1 minute)

Test the email generation without actually sending:

```bash
npm run outreach:test
```

This will:
- Load parks from `public/data/california.json`
- Generate 5 sample emails
- Show you what they look like
- **NOT send any real emails**

## Step 4: Send Your First Campaign (1 minute)

Once you're ready, send to a small batch:

```bash
# Send to 10 parks
npm run outreach:send -- --limit 10

# Send only to indoor dog parks
npm run outreach:send -- --filter-type "Indoor Dog Park" --limit 20

# Custom delay between emails (3 seconds)
npm run outreach:send -- --delay 3000 --limit 15
```

## What Happens?

1. Script loads parks from your JSON data file
2. Filters parks that have email addresses
3. Sends personalized outreach emails
4. Saves results to `outreach-results-{timestamp}.json`
5. Shows you a summary of successes/failures

## Example Output

```
🚀 Starting park outreach email campaign...

Configuration:
  Data file: public/data/california.json
  Test mode: NO (emails WILL be sent)
  Limit: 10 emails
  Delay: 2000ms between emails

📂 Loading park data...
   Loaded 150 parks

📊 Filtered to 45 parks with email addresses
📧 Will process 10 parks

[1/10] Sending to Happy Paws Indoor Park (info@happypaws.com)...
   ✅ Success (ID: re_abc123)
[2/10] Sending to Doggy Daycare Center (contact@doggydaycare.com)...
   ✅ Success (ID: re_def456)
...

📊 Campaign Summary
============================================================
Total processed: 10
✅ Successful: 9
❌ Failed: 1
Success rate: 90.0%

💾 Results saved to: outreach-results-1705320000000.json
```

## Important Notes

⚠️ **Before sending real emails:**
- Make sure you've verified your domain with Resend
- Start with small batches (5-10 emails)
- Monitor bounce rates and spam complaints
- Always test first with `--test` mode

📧 **Email Compliance:**
- All emails include unsubscribe links
- Follows CAN-SPAM guidelines
- Includes your contact information
- Professional, non-spammy content

## Troubleshooting

**"RESEND_API_KEY is not configured"**
→ Add it to your `.env.local` file

**"No parks found with email addresses"**
→ Check your JSON data file - parks need an `email` field

**Rate limit errors**
→ Increase the delay: `--delay 5000` (5 seconds)

## Next Steps

1. ✅ Test with `npm run outreach:test`
2. ✅ Send small batch (5-10 parks)
3. ✅ Monitor results and responses
4. ✅ Scale up gradually
5. ✅ Follow up after 5-7 days

## Need Help?

- Full guide: See `EMAIL_OUTREACH_GUIDE.md`
- API docs: Check `src/app/api/outreach/send/route.ts`
- Email templates: Edit `src/lib/email.ts`

Happy emailing! 🚀

