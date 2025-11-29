# Stripe MCP Server

This is a custom Model Context Protocol (MCP) server for Stripe integration, specifically created for the California Dog Parks Directory project.

## Features

This MCP server provides the following Stripe tools:

### Payment Management
- **create_payment_intent**: Create payment intents for processing payments
- **retrieve_payment_intent**: Get details of existing payment intents
- **confirm_payment_intent**: Confirm payment intents for payment processing
- **list_payment_intents**: List all payment intents with optional filtering

### Customer Management
- **create_customer**: Create new Stripe customers
- **retrieve_customer**: Retrieve customer details by ID
- **list_customers**: List all customers with optional filtering

### Checkout Sessions
- **create_checkout_session**: Create Stripe Checkout sessions for payments
- **list_prices**: List all available prices in your Stripe account

### Account Management
- **get_balance**: Get current account balance

## Installation

1. Ensure dependencies are installed:
   ```bash
   npm install
   ```

2. The server requires your Stripe secret key to be set in the environment:
   ```bash
   export STRIPE_SECRET_KEY="your_stripe_secret_key"
   ```

## Configuration with Claude Code

The MCP server is configured in `~/.config/claude-code/mcp-config.json`:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "node",
      "args": ["/Users/mahendrabalal/Desktop/new_indoordogpark/mcp-servers/stripe-server.js"],
      "env": {
        "STRIPE_SECRET_KEY": "your_stripe_secret_key_here"
      }
    }
  }
}
```

## Usage Examples

Once configured with Claude Code, you can use these commands:

### Create a Payment Intent
```
Create a payment intent for $50.00 for customer@example.com
```

### Create a Customer
```
Create a new customer with email john@example.com and name "John Doe"
```

### Check Balance
```
Get my current Stripe account balance
```

### List Payment Intents
```
List the last 10 payment intents with status 'succeeded'
```

### Create Checkout Session
```
Create a checkout session with success_url https://example.com/success and cancel_url https://example.com/cancel
```

## Environment Variables

- `STRIPE_SECRET_KEY`: Your Stripe secret key (required)
- `NODE_ENV`: Environment setting (optional, defaults to production)

## Security Notes

- Keep your Stripe secret key secure and never commit it to version control
- The server reads the secret key from environment variables for security
- Use test keys during development and only switch to live keys in production

## Development

The server is built using the Model Context Protocol SDK and the official Stripe Node.js library. It communicates via stdio, which is the standard for MCP servers.

To test the server directly:
```bash
STRIPE_SECRET_KEY=your_test_key node stripe-server.js
```

## Available Tools Reference

### create_payment_intent
- **amount**: Number (required) - Amount in cents (e.g., 2000 for $20.00)
- **currency**: String (optional) - Currency code, defaults to 'usd'
- **customer_email**: String (optional) - Customer email address
- **metadata**: Object (optional) - Additional metadata for the payment

### retrieve_payment_intent
- **payment_intent_id**: String (required) - The ID of the payment intent to retrieve

### confirm_payment_intent
- **payment_intent_id**: String (required) - The ID of the payment intent to confirm

### create_customer
- **email**: String (required) - Customer email address
- **name**: String (optional) - Customer name
- **phone**: String (optional) - Customer phone number
- **metadata**: Object (optional) - Additional metadata for the customer

### retrieve_customer
- **customer_id**: String (required) - The ID of the customer to retrieve

### list_customers
- **limit**: Number (optional) - Maximum number of customers to return, defaults to 10
- **email**: String (optional) - Filter by email address

### create_checkout_session
- **success_url**: String (required) - URL to redirect to after successful payment
- **cancel_url**: String (required) - URL to redirect to after cancelled payment
- **price_id**: String (optional) - Price ID for the product/service
- **customer_email**: String (optional) - Customer email address
- **mode**: String (optional) - Checkout mode, defaults to 'payment'

### list_prices
- **limit**: Number (optional) - Maximum number of prices to return, defaults to 10
- **active**: Boolean (optional) - Filter for active prices only, defaults to true

### get_balance
- No parameters required

### list_payment_intents
- **limit**: Number (optional) - Maximum number of payment intents to return, defaults to 10
- **status**: String (optional) - Filter by status (requires_payment_method, processing, requires_action, succeeded, canceled)
- **customer**: String (optional) - Filter by customer ID