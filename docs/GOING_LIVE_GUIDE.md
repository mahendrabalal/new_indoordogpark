# 🚀 Going Live with Stripe - Complete Setup Guide

## 🔧 Current Status
- ✅ Test mode working (12 successful test payments)
- ✅ Webhook handlers implemented
- ✅ Payment flow functional
- 🔄 Need to switch to LIVE MODE

## 📋 Live Mode Setup Checklist

### 1️⃣ Get Live Stripe Keys
- [ ] Log into [Stripe Dashboard](https://dashboard.stripe.com)
- [ ] Toggle from "Test mode" to "Live mode" (top-left)
- [ ] Go to Developers → API keys
- [ ] Copy:
  - `pk_live_...` (Publishable key)
  - `sk_live_...` (Secret key)

### 2️⃣ Create Live Product & Price
- [ ] Go to Products → Add product
- [ ] Product Name: "Featured Park Listing"
- [ ] Description: "Premium featured listing for dog parks"
- [ ] Add Pricing:
  - Amount: $9.99
  - Currency: USD (or EUR)
  - Billing: Recurring Monthly
- [ ] Copy the `price_...` ID

### 3️⃣ Configure Live Webhooks
- [ ] Go to Developers → Webhooks
- [ ] Add endpoint: `https://yourdomain.com/api/stripe/webhook`
- [ ] Select events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- [ ] Copy webhook signing secret (`whsec_...`)

### 4️⃣ Update Environment Variables
Replace in `.env.local`:
```env
# OLD (Test mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...test...
STRIPE_FEATURED_PRICE_ID=price_1SRLMoBRI1zwzamTyMhRRHj9

# NEW (Live mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
STRIPE_FEATURED_PRICE_ID=price_YOUR_LIVE_PRICE_ID
```

### 5️⃣ Update Production URL
Change in `.env.local`:
```env
# OLD
NEXT_PUBLIC_BASE_URL=http://localhost:3002

# NEW
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 6️⃣ Update MCP Server for Live Mode
Replace in `~/.config/claude-code/mcp-config.json`:
```json
{
  "mcpServers": {
    "stripe": {
      "command": "node",
      "args": ["/Users/mahendrabalal/Desktop/new_indoordogpark/mcp-servers/stripe-server.js"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_live_YOUR_LIVE_SECRET_KEY_HERE"
      }
    }
  }
}
```

### 7️⃣ Deploy to Production
- [ ] Push changes to production
- [ ] Deploy your app
- [ ] Test with a real payment (small amount first)

## ⚠️ Important Notes

### Security
- **NEVER** commit live keys to git
- Keep `.env.local` in `.gitignore`
- Use environment variables in production

### Testing
- Test with small amounts first
- Verify webhooks are receiving events
- Check database updates after payments

### Compliance
- Ensure your Stripe account is fully verified
- Set up proper business information
- Configure payout settings

## 🚨 Before Going Live - Final Verification

### Test These Scenarios:
1. ✅ User submits free listing
2. ✅ User submits featured listing ($9.99)
3. ✅ Payment succeeds → Database updates to 'featured'
4. ✅ Webhook receives events correctly
5. ✅ Featured listing appears on homepage
6. ✅ Subscription cancellation → Listing downgrades to 'free'

### Checklist:
- [ ] Live keys configured
- [ ] Live product/price created
- [ ] Live webhooks configured
- [ ] Production URL updated
- [ ] MCP server updated
- [ ] App deployed
- [ ] Real payment tested
- [ ] Database integration verified

## 🎯 You're Ready to Go Live!

Once these steps are completed:
- Your app will process real payments
- Premium park listings will be fully functional
- You'll receive actual payouts to your bank account
- The MCP server will access live Stripe data

## 🆘 Need Help?

- Stripe Support: https://support.stripe.com
- Stripe Docs: https://stripe.com/docs
- Your MCP server is ready for live mode once keys are updated