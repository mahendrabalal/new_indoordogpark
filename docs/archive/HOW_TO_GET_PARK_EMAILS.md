# How to Get Email Addresses for Dog Parks

The email outreach system is ready, but your park data doesn't include email addresses. Here are several ways to obtain them:

## Method 1: Extract from Park Websites (Recommended)

Most parks list contact emails on their websites. You can:

### Option A: Manual Collection
1. Visit each park's website (from your `website` field)
2. Look for "Contact Us", "About", or footer sections
3. Collect emails and add them to your JSON data

### Option B: Automated Scraping Script
Create a script to extract emails from park websites:

```python
# scripts/extract_emails_from_websites.py
import json
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def extract_email_from_url(url):
    try:
        response = requests.get(url, timeout=10)
        html = response.text
        # Find email patterns
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', html)
        # Filter out common non-contact emails
        filtered = [e for e in emails if not any(x in e.lower() for x in ['noreply', 'no-reply', 'privacy', 'legal'])]
        return filtered[0] if filtered else None
    except:
        return None

# Load parks
with open('public/data/california.json', 'r') as f:
    parks = json.load(f)

# Extract emails
for park in parks:
    if park.get('website') and not park.get('email'):
        email = extract_email_from_url(park['website'])
        if email:
            park['email'] = email
            print(f"Found email for {park['name']}: {email}")

# Save updated data
with open('public/data/california.json', 'w') as f:
    json.dump(parks, f, indent=2)
```

## Method 2: Use Google Places API Details

The Google Places API sometimes includes email in the "contact" field:

```python
# scripts/fetch_emails_from_google.py
import json
import googlemaps

gmaps = googlemaps.Client(key='YOUR_API_KEY')

with open('public/data/california.json', 'r') as f:
    parks = json.load(f)

for park in parks:
    if park.get('googlePlaceId') and not park.get('email'):
        try:
            place = gmaps.place(place_id=park['googlePlaceId'], fields=['email'])
            if 'email' in place['result']:
                park['email'] = place['result']['email']
                print(f"Found email for {park['name']}")
        except:
            pass
```

## Method 3: Use Business Directory APIs

### Yelp Fusion API
Yelp sometimes has contact emails:
```python
import yelpapi

yelp = yelpapi.YelpAPI('YOUR_API_KEY')
# Search for business and extract contact info
```

### Yellow Pages API
Some business directories provide email addresses.

## Method 4: Manual Research

For high-priority parks:

1. **Google Search**: `"[Park Name]" "[City]" contact email`
2. **Social Media**: Check Facebook, Instagram for contact info
3. **LinkedIn**: Find business pages
4. **Local Directories**: Chamber of commerce, local business listings

## Method 5: Use Park Submission Form

Encourage parks to submit their own listings with email:

1. Add a "List Your Park" form on your website
2. Parks submit their own information including email
3. Verify and approve submissions
4. Use verified emails for outreach

## Quick Implementation: Add Email Field to Existing Data

If you have a small list, manually add emails:

```json
{
  "id": "ChIJ...",
  "name": "Happy Paws Indoor Park",
  "email": "info@happypaws.com",  // Add this field
  "website": "https://happypaws.com",
  ...
}
```

## Testing Without Real Emails

You can test the email system with dummy emails:

```bash
# Create a test data file
echo '[{"name":"Test Park","email":"test@example.com","city":"Los Angeles"}]' > test-parks.json

# Test with dummy data
npm run outreach:send -- --file test-parks.json --limit 1
```

## Best Practices

1. **Start Small**: Begin with 10-20 parks you manually verify
2. **Verify Emails**: Use email validation before sending
3. **Respect Privacy**: Only email parks that have publicly listed emails
4. **Comply with CAN-SPAM**: Include unsubscribe links
5. **Track Sources**: Note where you got each email

## Next Steps

1. ✅ Email system is configured and ready
2. 📧 Collect email addresses using methods above
3. 🧪 Test with a small batch (5-10 parks)
4. 📈 Scale up gradually
5. 📊 Monitor open rates and responses

## Need Help?

- Check `EMAIL_OUTREACH_GUIDE.md` for full documentation
- See `EMAIL_OUTREACH_QUICKSTART.md` for setup steps
- Test email API: `npm run outreach:test`


