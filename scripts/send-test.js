const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const targetEmail = process.argv[2];

if (!targetEmail || !targetEmail.includes('@')) {
  console.log('❌ Please provide your email address to send the test to.');
  console.log('Usage: node scripts/send-test.js your.email@example.com');
  process.exit(1);
}

const testPark = {
  parkName: "Bark & Play (Test Park)",
  parkSlug: "bark-and-play-test",
  parkEmail: targetEmail,
  parkCity: "San Francisco",
  parkState: "CA",
  parkWebsite: "https://example.com",
  testMode: false // We set this to false so it actually sends via Resend!
};

console.log(`🚀 Sending test email to ${targetEmail}...`);

fetch(`${baseUrl}/api/outreach/send`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testPark),
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    console.log(`✅ Success! Email sent (ID: ${data.emailId})`);
    console.log('Check your inbox!');
  } else {
    console.log(`❌ Failed: ${data.error}`);
  }
})
.catch(err => {
  console.log(`❌ Error: ${err.message}`);
});
