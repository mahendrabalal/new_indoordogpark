import json
from collections import Counter

def analyze_transformation():
    """Analyze the transformation results."""
    
    # Read the standardized data
    with open('data/standardized_dog_parks.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("=== Google Places to Standard JSON Transformation Summary ===\n")
    
    # Basic stats
    print(f"Total records transformed: {len(data)}")
    
    # Business type distribution
    business_types = [item['businessType'] for item in data]
    type_counts = Counter(business_types)
    print(f"\nBusiness Type Distribution:")
    for btype, count in type_counts.items():
        print(f"  {btype}: {count}")
    
    # State distribution
    states = [item['state'] for item in data]
    state_counts = Counter(states)
    print(f"\nState Distribution:")
    for state, count in state_counts.items():
        print(f"  {state}: {count}")
    
    # Cities represented
    cities = sorted(set(item['city'] for item in data))
    print(f"\nCities represented ({len(cities)}):")
    for city in cities:
        print(f"  • {city}")
    
    # Rating statistics
    ratings = [item['rating'] for item in data if item['rating'] > 0]
    if ratings:
        avg_rating = sum(ratings) / len(ratings)
        print(f"\nRating Statistics:")
        print(f"  Average rating: {avg_rating:.2f}")
        print(f"  Highest rating: {max(ratings)}")
        print(f"  Lowest rating: {min(ratings)}")
    
    # Phone number coverage
    with_phone = len([item for item in data if item['phone']])
    print(f"\nPhone Number Coverage:")
    print(f"  With phone: {with_phone}/{len(data)} ({with_phone/len(data)*100:.1f}%)")
    
    # Website coverage
    with_website = len([item for item in data if 'website' in item and item['website']])
    print(f"\nWebsite Coverage:")
    print(f"  With website: {with_website}/{len(data)} ({with_website/len(data)*100:.1f}%)")
    
    # Image coverage
    with_images = len([item for item in data if item.get('images') and len(item['images']) > 0])
    total_images = sum(len(item.get('images', [])) for item in data)
    print(f"\nImage Coverage:")
    print(f"  Records with images: {with_images}/{len(data)} ({with_images/len(data)*100:.1f}%)")
    print(f"  Total images: {total_images}")
    print(f"  Average images per record: {total_images/len(data):.1f}")
    
    print(f"\n=== Sample Records ===")
    
    # Show record with most images
    record_with_most_images = max(data, key=lambda x: len(x.get('images', [])))
    print(f"\n1. Record with Most Images ({len(record_with_most_images.get('images', []))} images):")
    print(f"   Name: {record_with_most_images['name']}")
    print(f"   Type: {record_with_most_images['businessType']}")
    print(f"   Address: {record_with_most_images['full_address']}")
    print(f"   Rating: {record_with_most_images['rating']}")
    print(f"   Website: {record_with_most_images.get('website', 'N/A')}")
    print(f"   Sample image URL: {record_with_most_images.get('images', ['N/A'])[0][:60]}...")
    
    # Show highest rated record
    highest_rated = max(data, key=lambda x: x.get('rating', 0))
    print(f"\n2. Highest Rated Record:")
    print(f"   Name: {highest_rated['name']}")
    print(f"   Type: {highest_rated['businessType']}")
    print(f"   Address: {highest_rated['full_address']}")
    print(f"   Rating: {highest_rated['rating']}")
    print(f"   Reviews: {highest_rated.get('reviewCount', 0)}")
    print(f"   Website: {highest_rated.get('website', 'N/A')}")

if __name__ == "__main__":
    analyze_transformation()