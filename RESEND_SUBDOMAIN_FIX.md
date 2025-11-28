# How to Change Resend MX Record from @ to mail Subdomain

## Problem
Resend's receiving MX record is set to `@` (root domain) and it's not editable in the dashboard. This conflicts with your ImprovMX records.

## Solutions

### Option 1: Use Resend API (If Available)
Resend API might allow configuring subdomain receiving. Check their API documentation:
- https://resend.com/docs/api-reference/domains

### Option 2: Contact Resend Support (Recommended)
1. Go to: https://resend.com/support
2. Or email: support@resend.com
3. Request: "Please configure email receiving to use `mail` subdomain instead of root domain `@`"
4. Explain: You have existing MX records for root domain and need subdomain receiving

### Option 3: Delete and Re-add Domain with Subdomain
1. In Resend dashboard, you might be able to:
   - Delete the current domain configuration
   - Re-add it and specify subdomain during setup
   - **Warning:** This might require re-verification

### Option 4: Use Root Domain Anyway (Not Recommended)
If you can't change it:
- Remove ImprovMX MX records temporarily
- Let Resend verify the root domain
- **Downside:** You'll lose ImprovMX email forwarding

### Option 5: Keep Both (Workaround)
Since you already added `mail` subdomain MX in Namecheap:
- Resend won't verify it (because it's checking `@`)
- But emails sent to `@mail.indoordogpark.org` might still work
- You can test by sending an email to `test@mail.indoordogpark.org`

## Recommended Action

**Contact Resend Support:**
1. Go to: https://resend.com/support
2. Subject: "Configure email receiving for subdomain instead of root domain"
3. Message:
   ```
   Hi,
   
   I need to configure email receiving to use a subdomain (mail.indoordogpark.org) 
   instead of the root domain (@) because I have existing MX records for the root 
   domain pointing to ImprovMX for email forwarding.
   
   The MX record for mail subdomain is already added in my DNS. Can you help 
   configure Resend to use the mail subdomain for receiving?
   
   Domain: indoordogpark.org
   Desired subdomain: mail
   ```
4. They should be able to configure it on their end

## Alternative: Check Resend Settings

Sometimes the subdomain configuration is in a different place:
1. Go to your domain in Resend
2. Look for "Settings" or "Advanced" tab
3. Check for "Receiving Configuration" or "Inbound Settings"
4. See if there's an option to specify subdomain

## Testing While Waiting

Even if Resend shows "Pending" for `@`, you can test if `mail` subdomain works:
1. Send a test email to: `test@mail.indoordogpark.org`
2. Check if it arrives (might work even if not "verified" in Resend)
3. Configure forwarding in Resend to your email address

---

**Best Solution:** Contact Resend support - they can configure this on the backend.

