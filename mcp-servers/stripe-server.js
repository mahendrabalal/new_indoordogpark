#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');
const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class StripeMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'stripe-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_payment_intent',
            description: 'Create a Stripe Payment Intent for processing payments',
            inputSchema: {
              type: 'object',
              properties: {
                amount: {
                  type: 'number',
                  description: 'Amount in cents (e.g., 2000 for $20.00)',
                },
                currency: {
                  type: 'string',
                  description: 'Currency code (default: usd)',
                  default: 'usd',
                },
                customer_email: {
                  type: 'string',
                  description: 'Customer email address',
                },
                metadata: {
                  type: 'object',
                  description: 'Additional metadata for the payment',
                },
              },
              required: ['amount'],
            },
          },
          {
            name: 'retrieve_payment_intent',
            description: 'Retrieve a payment intent by its ID',
            inputSchema: {
              type: 'object',
              properties: {
                payment_intent_id: {
                  type: 'string',
                  description: 'The ID of the payment intent to retrieve',
                },
              },
              required: ['payment_intent_id'],
            },
          },
          {
            name: 'confirm_payment_intent',
            description: 'Confirm a payment intent',
            inputSchema: {
              type: 'object',
              properties: {
                payment_intent_id: {
                  type: 'string',
                  description: 'The ID of the payment intent to confirm',
                },
              },
              required: ['payment_intent_id'],
            },
          },
          {
            name: 'create_customer',
            description: 'Create a new Stripe customer',
            inputSchema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'Customer email address',
                },
                name: {
                  type: 'string',
                  description: 'Customer name',
                },
                phone: {
                  type: 'string',
                  description: 'Customer phone number',
                },
                metadata: {
                  type: 'object',
                  description: 'Additional metadata for the customer',
                },
              },
              required: ['email'],
            },
          },
          {
            name: 'retrieve_customer',
            description: 'Retrieve a customer by their ID',
            inputSchema: {
              type: 'object',
              properties: {
                customer_id: {
                  type: 'string',
                  description: 'The ID of the customer to retrieve',
                },
              },
              required: ['customer_id'],
            },
          },
          {
            name: 'list_customers',
            description: 'List all customers with optional filtering',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Maximum number of customers to return (default: 10)',
                  default: 10,
                },
                email: {
                  type: 'string',
                  description: 'Filter by email address',
                },
              },
            },
          },
          {
            name: 'create_checkout_session',
            description: 'Create a Stripe Checkout Session for one-time payments',
            inputSchema: {
              type: 'object',
              properties: {
                success_url: {
                  type: 'string',
                  description: 'URL to redirect to after successful payment',
                },
                cancel_url: {
                  type: 'string',
                  description: 'URL to redirect to after cancelled payment',
                },
                price_id: {
                  type: 'string',
                  description: 'Price ID for the product/service',
                },
                customer_email: {
                  type: 'string',
                  description: 'Customer email address',
                },
                mode: {
                  type: 'string',
                  description: 'Checkout mode (payment, subscription)',
                  default: 'payment',
                },
              },
              required: ['success_url', 'cancel_url'],
            },
          },
          {
            name: 'list_prices',
            description: 'List all available prices in your Stripe account',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Maximum number of prices to return (default: 10)',
                  default: 10,
                },
                active: {
                  type: 'boolean',
                  description: 'Filter for active prices only',
                  default: true,
                },
              },
            },
          },
          {
            name: 'get_balance',
            description: 'Get the current balance of your Stripe account',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_payment_intents',
            description: 'List payment intents with optional filtering',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Maximum number of payment intents to return (default: 10)',
                  default: 10,
                },
                status: {
                  type: 'string',
                  description: 'Filter by status (requires_payment_method, processing, requires_action, succeeded, canceled)',
                },
                customer: {
                  type: 'string',
                  description: 'Filter by customer ID',
                },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_payment_intent':
            return await this.createPaymentIntent(args);
          case 'retrieve_payment_intent':
            return await this.retrievePaymentIntent(args);
          case 'confirm_payment_intent':
            return await this.confirmPaymentIntent(args);
          case 'create_customer':
            return await this.createCustomer(args);
          case 'retrieve_customer':
            return await this.retrieveCustomer(args);
          case 'list_customers':
            return await this.listCustomers(args);
          case 'create_checkout_session':
            return await this.createCheckoutSession(args);
          case 'list_prices':
            return await this.listPrices(args);
          case 'get_balance':
            return await this.getBalance();
          case 'list_payment_intents':
            return await this.listPaymentIntents(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Stripe API error: ${error.message}`
        );
      }
    });
  }

  async createPaymentIntent({ amount, currency = 'usd', customer_email, metadata }) {
    const paymentIntentData = {
      amount: Math.round(amount),
      currency,
      metadata: metadata || {},
    };

    if (customer_email) {
      paymentIntentData.receipt_email = customer_email;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    return {
      content: [
        {
          type: 'text',
          text: `Payment Intent created successfully:\n\nID: ${paymentIntent.id}\nAmount: $${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}\nStatus: ${paymentIntent.status}\nClient Secret: ${paymentIntent.client_secret}`,
        },
      ],
    };
  }

  async retrievePaymentIntent({ payment_intent_id }) {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    return {
      content: [
        {
          type: 'text',
          text: `Payment Intent Details:\n\nID: ${paymentIntent.id}\nAmount: $${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}\nStatus: ${paymentIntent.status}\nCreated: ${new Date(paymentIntent.created * 1000).toISOString()}\n${paymentIntent.receipt_email ? `Receipt Email: ${paymentIntent.receipt_email}` : ''}`,
        },
      ],
    };
  }

  async confirmPaymentIntent({ payment_intent_id }) {
    const paymentIntent = await stripe.paymentIntents.confirm(payment_intent_id);

    return {
      content: [
        {
          type: 'text',
          text: `Payment Intent confirmed:\n\nID: ${paymentIntent.id}\nStatus: ${paymentIntent.status}\nAmount: $${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}`,
        },
      ],
    };
  }

  async createCustomer({ email, name, phone, metadata }) {
    const customerData = {
      email,
      metadata: metadata || {},
    };

    if (name) customerData.name = name;
    if (phone) customerData.phone = phone;

    const customer = await stripe.customers.create(customerData);

    return {
      content: [
        {
          type: 'text',
          text: `Customer created successfully:\n\nID: ${customer.id}\nEmail: ${customer.email}\nName: ${customer.name || 'Not provided'}\nCreated: ${new Date(customer.created * 1000).toISOString()}`,
        },
      ],
    };
  }

  async retrieveCustomer({ customer_id }) {
    const customer = await stripe.customers.retrieve(customer_id);

    return {
      content: [
        {
          type: 'text',
          text: `Customer Details:\n\nID: ${customer.id}\nEmail: ${customer.email}\nName: ${customer.name || 'Not provided'}\nPhone: ${customer.phone || 'Not provided'}\nCreated: ${new Date(customer.created * 1000).toISOString()}`,
        },
      ],
    };
  }

  async listCustomers({ limit = 10, email }) {
    const params = { limit };
    if (email) params.email = email;

    const customers = await stripe.customers.list(params);

    const customerList = customers.data.map(customer =>
      `${customer.id}: ${customer.email}${customer.name ? ` (${customer.name})` : ''}`
    ).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Customers (${customers.data.length} found):\n\n${customerList}`,
        },
      ],
    };
  }

  async createCheckoutSession({ success_url, cancel_url, price_id, customer_email, mode = 'payment' }) {
    const sessionData = {
      mode,
      success_url,
      cancel_url,
    };

    if (price_id) {
      sessionData.line_items = [{ price: price_id, quantity: 1 }];
    } else {
      sessionData.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Custom Payment',
            },
            unit_amount: 2000, // $20.00 default
          },
          quantity: 1,
        },
      ];
    }

    if (customer_email) {
      sessionData.customer_email = customer_email;
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    return {
      content: [
        {
          type: 'text',
          text: `Checkout Session created:\n\nID: ${session.id}\nURL: ${session.url}\nMode: ${session.mode}\nStatus: ${session.status}`,
        },
      ],
    };
  }

  async listPrices({ limit = 10, active = true }) {
    const prices = await stripe.prices.list({ limit, active });

    const priceList = prices.data.map(price =>
      `${price.id}: ${price.nickname || 'No nickname'} - $${(price.unit_amount / 100).toFixed(2)} ${price.currency.toUpperCase()} (${price.type})`
    ).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Available Prices (${prices.data.length} found):\n\n${priceList}`,
        },
      ],
    };
  }

  async getBalance() {
    const balance = await stripe.balance.retrieve();

    let balanceInfo = '';
    let pendingInfo = '';

    if (balance.available && balance.available.length > 0) {
      balanceInfo = balance.available.map(item =>
        `${item.currency.toUpperCase()}: $${(item.amount / 100).toFixed(2)}`
      ).join('\n');
    } else {
      balanceInfo = 'No available balance';
    }

    if (balance.pending && balance.pending.length > 0) {
      pendingInfo = balance.pending.map(item =>
        `${item.currency.toUpperCase()}: $${(item.amount / 100).toFixed(2)}`
      ).join('\n');
    } else {
      pendingInfo = 'No pending balance';
    }

    return {
      content: [
        {
          type: 'text',
          text: `Current Balance:\n\nAvailable:\n${balanceInfo}\n\nPending:\n${pendingInfo}`,
        },
      ],
    };
  }

  async listPaymentIntents({ limit = 10, status, customer }) {
    const params = { limit };
    if (status) params.status = status;
    if (customer) params.customer = customer;

    const paymentIntents = await stripe.paymentIntents.list(params);

    const intentList = paymentIntents.data.map(intent =>
      `${intent.id}: $${(intent.amount / 100).toFixed(2)} ${intent.currency.toUpperCase()} - ${intent.status} (${new Date(intent.created * 1000).toISOString()})`
    ).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Payment Intents (${paymentIntents.data.length} found):\n\n${intentList}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Stripe MCP server running on stdio');
  }
}

const server = new StripeMCPServer();
server.run().catch(console.error);