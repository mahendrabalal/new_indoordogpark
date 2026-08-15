require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function checkStripe() {
  console.log('Checking Stripe Configuration...');
  try {
    // Check if we can fetch balance (requires valid secret key)
    const balance = await stripe.balance.retrieve();
    console.log('✅ Stripe authentication successful.');
    console.log(`   Mode: ${process.env.STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'LIVE' : 'TEST'}`);

    // Check the featured price ID
    if (process.env.STRIPE_FEATURED_PRICE_ID) {
      console.log(`\nChecking Price ID: ${process.env.STRIPE_FEATURED_PRICE_ID}`);
      const price = await stripe.prices.retrieve(process.env.STRIPE_FEATURED_PRICE_ID);
      console.log(`✅ Price exists: ${price.active ? 'Active' : 'Inactive'} - ${(price.unit_amount / 100).toFixed(2)} ${price.currency.toUpperCase()}`);
      
      const product = await stripe.products.retrieve(price.product);
      console.log(`✅ Associated Product: ${product.name} (${product.active ? 'Active' : 'Inactive'})`);
    } else {
      console.log('⚠️ No STRIPE_FEATURED_PRICE_ID found in environment variables.');
    }

    console.log('\nStripe is working correctly! 🎉');
  } catch (error) {
    console.error('\n❌ Stripe Check Failed:');
    console.error(error.message);
  }
}

checkStripe();
