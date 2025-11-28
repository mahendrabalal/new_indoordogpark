# Setup Email Receiving in Resend

## Overview

To receive emails sent to addresses like `outreach@indoordogpark.org` or `partnerships@indoordogpark.org`, you need to enable email receiving in Resend.

## Steps to Enable Email Receiving

### Step 1: Enable Receiving in Resend Dashboard

1. Go to: https://resend.com/domains
2. Click on your domain `indoordogpark.org`
3. Find the **"Enable Receiving"** section
4. Toggle it **ON** (it should turn green)

### Step 2: Add MX Records to Your DNS

Resend will show you MX records to add. They will look like:

```
Type: MX
Host: @
Value: inbound-smtp.us-east-1.amazonaws.com
Priority: 10
TTL: Auto
```

**In Namecheap:**
1. Go to Domain List → Manage → Advanced DNS
2. Scroll to "Mail Settings" section
3. Click "Add New Record"
4. Select "MX Record"
5. Fill in:
   - Host: `@` (or leave blank for root domain)
   - Value: `inbound-smtp.us-east-1.amazonaws.com` (or what Resend shows)
   - Priority: `10` (or what Resend shows)
   - TTL: `Automatic`
6. Click the checkmark to save

### Step 3: Configure Email Forwarding/Delivery

After adding MX records, you need to tell Resend where to forward emails:

1. In Resend dashboard, go to your domain settings
2. Look for "Email Receiving" or "Inbound" settings
3. Configure where emails should be delivered:
   - Option 1: Forward to your personal email (e.g., mahendrabalal2025@gmail.com)
   - Option 2: Use Resend's webhook to receive emails programmatically
   - Option 3: Use Resend's API to fetch emails

### Step 4: Wait for DNS Propagation

- Wait 5-15 minutes for MX records to propagate
- Resend will verify the MX records
- Once verified, you can receive emails

## What Email Addresses Can Receive?

Once set up, you can receive emails at:
- `outreach@indoordogpark.org`
- `partnerships@indoordogpark.org`
- `support@indoordogpark.org`
- Any address at `@indoordogpark.org`

## Testing Email Receiving

After setup, test by:
1. Sending an email from another account to `outreach@indoordogpark.org`
2. Check if it arrives at your configured forwarding address
3. Or check Resend's "Receiving" tab in the Emails section

## Alternative: Use Email Forwarding Service

If you prefer a simpler setup, you can use:
- **ImprovMX** (you already have MX records for this)
- **ForwardMX**
- **Google Workspace** (if you have it)

But Resend's receiving is integrated and works well with your sending setup.

---

**Note:** The MX records for receiving are different from the MX records for sending. You need both:
- **Sending MX:** `send` subdomain → `feedback-smtp.us-east-1.amazonaws.com`
- **Receiving MX:** `@` root domain → `inbound-smtp.us-east-1.amazonaws.com`

