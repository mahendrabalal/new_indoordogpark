# Stripe CLI Examples

Yes, you can use Stripe in the terminal! The Stripe CLI is a powerful tool that allows you to interact with Stripe's API directly from your command line.

## Installation
You already have the Stripe CLI installed at `/opt/homebrew/bin/stripe` (version 1.30.0).

## Common Commands

### 1. Authentication
```bash
# Login to your Stripe account
stripe login

# Check current configuration
stripe config --list

# Logout
stripe logout
```

### 2. Managing Customers
```bash
# List customers
stripe customers list --limit 5

# Create a new customer
stripe customers create --email "customer@example.com" --name "John Doe"

# Retrieve a specific customer
stripe customers retrieve cus_TCkR1iGb0Piu3C
```

### 3. Managing Payment Intents
```bash
# Create a payment intent
stripe payment_intents create --amount 2000 --currency usd --description "Test payment"

# Retrieve a payment intent
stripe payment_intents retrieve pi_3SQbeSFBheWcIExC1FzB3KMb

# Confirm a payment intent
stripe payment_intents confirm pi_3SQbeSFBheWcIExC1FzB3KMb --payment_method pm_card_visa
```

### 4. Managing Charges
```bash
# List charges
stripe charges list --limit 5

# Create a direct charge (requires a card token)
stripe charges create --amount 2000 --currency usd --source tok_visa --description "Direct charge"
```

### 5. Webhook Management
```bash
# Listen for webhook events and forward to local server
stripe listen --forward-to localhost:3000/webhook

# Trigger test webhook events
stripe trigger payment_intent.succeeded
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.created
```

### 6. Managing Products and Prices
```bash
# List products
stripe products list --limit 5

# Create a product
stripe products create --name "Premium Plan" --description "Monthly subscription"

# Create a price for a product
stripe prices create --unit_amount 2000 --currency usd --product prod_xxx --recurring interval=month
```

### 7. Managing Subscriptions
```bash
# Create a subscription
stripe subscriptions create --customer cus_TCkR1iGb0Piu3C --items price=price_xxx

# List subscriptions
stripe subscriptions list --limit 5
```

### 8. Viewing Resources
```bash
# Quick retrieval of any resource
stripe get ch_3SQGgZFBheWcIExC2es2nI79
stripe get cus_TCkR1iGb0Piu3C
stripe get pi_3SQbeSFBheWcIExC1FzB3KMb
```

### 9. Opening Stripe Dashboard
```bash
# Open your Stripe dashboard
stripe open dashboard

# Open a specific resource
stripe open customers/cus_TCkR1iGb0Piu3C
stripe open charges/ch_3SQGgZFBheWcIExC2es2nI79
```

## Tips

1. **Use JSON output**: All commands return JSON, making them easy to parse with tools like `jq`:
   ```bash
   stripe customers list | jq '.data[].email'
   ```

2. **Filter results**: Use flags to filter and limit results:
   ```bash
   stripe charges list --limit 10 --created ">=2024-01-01"
   ```

3. **Save API keys**: The CLI securely stores your API keys after login.

4. **Test mode**: By default, the CLI uses test mode keys for safe testing.

5. **Update CLI**: Keep your CLI updated for the latest features:
   ```bash
   stripe update
   ```

## Integration with Development Workflow

The Stripe CLI is particularly useful for:
- Testing webhook endpoints during development
- Quickly creating test data
- Debugging payment issues
- Automating Stripe operations in scripts

You're currently running a webhook listener that forwards events to `localhost:3000/webhook`, which is perfect for testing webhook integrations in your local development environment.