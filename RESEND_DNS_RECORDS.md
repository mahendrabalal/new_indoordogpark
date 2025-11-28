# Resend DNS Records Setup

## Required DNS Records for Resend Domain Verification

Based on your DNS panel, here are the records you need to add:

### 1. SPF Record (TXT) - For `send` subdomain
**Add this record:**
```
Type: TXT
Host: send
Value: v=spf1 include:amazonses.com ~all
TTL: Auto
```

This allows Resend (which uses Amazon SES) to send emails from `send@indoordogpark.org`.

### 2. DKIM Record (TXT) - Already Added ✅
You already have:
```
Host: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBIQKBg... (your key)
```

### 3. Domain Verification (TXT) - Check Resend Dashboard
Resend will also provide a domain verification TXT record. Check your Resend dashboard at:
https://resend.com/domains

It will look something like:
```
Type: TXT
Host: @
Value: resend-verification=your-verification-code-here
```

## Steps to Complete Verification

1. ✅ **Add the SPF record** (the one you mentioned):
   - Host: `send`
   - Type: TXT
   - Value: `v=spf1 include:amazonses.com ~all`

2. ✅ **DKIM is already added** (resend._domainkey)

3. **Add domain verification TXT record** from Resend dashboard:
   - Go to https://resend.com/domains
   - Click on your domain
   - Copy the verification TXT record
   - Add it to your DNS

4. **Wait for DNS propagation** (usually 5-15 minutes)

5. **Click "Verify" in Resend dashboard**

## After Verification

Once verified, update your `.env.local`:
```bash
RESEND_FROM_EMAIL=IndoorDogPark <outreach@indoordogpark.org>
```

Or use the `send` subdomain:
```bash
RESEND_FROM_EMAIL=IndoorDogPark <outreach@send.indoordogpark.org>
```

Then re-run your email campaign!

---

**Note:** The SPF record you're adding (`v=spf1 include:amazonses.com ~all`) is correct for Resend since they use Amazon SES for sending.

