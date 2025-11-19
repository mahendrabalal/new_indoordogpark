import json
from collections import Counter

# Load the data
with open('public/data/california.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total parks: {len(data)}\n")

# Analyze business types
types = Counter(p.get('businessType', 'Unknown') for p in data)
print("Business types:")
for t, count in sorted(types.items()):
    print(f"  {t}: {count}")

# Analyze description patterns
print("\n" + "="*60)
print("DESCRIPTION ANALYSIS")
print("="*60)

# Group descriptions by length
short_descs = [p for p in data if len(p.get('description', '')) < 80]
medium_descs = [p for p in data if 80 <= len(p.get('description', '')) < 150]
long_descs = [p for p in data if len(p.get('description', '')) >= 150]

print(f"\nDescription lengths:")
print(f"  Short (< 80 chars): {len(short_descs)}")
print(f"  Medium (80-149 chars): {len(medium_descs)}")
print(f"  Long (≥ 150 chars): {len(long_descs)}")

# Check for pattern variations
pattern_simple = [p for p in data if "is a dog park in" in p.get('description', '')]
pattern_dedicated = [p for p in data if "dedicated dog park" in p.get('description', '').lower()]
pattern_indoor = [p for p in data if "indoor" in p.get('description', '').lower()]
pattern_dog_friendly = [p for p in data if "dog-friendly" in p.get('description', '').lower()]

print(f"\nDescription patterns:")
print(f"  Simple pattern ('is a dog park in'): {len(pattern_simple)}")
print(f"  Contains 'dedicated': {len(pattern_dedicated)}")
print(f"  Contains 'indoor': {len(pattern_indoor)}")
print(f"  Contains 'dog-friendly': {len(pattern_dog_friendly)}")

# Show examples of different patterns
print("\n" + "="*60)
print("SAMPLE DESCRIPTIONS")
print("="*60)

print("\n1. Simple pattern examples:")
for i, p in enumerate(pattern_simple[:3]):
    print(f"   {i+1}. {p['name']}: {p['description']}")

if pattern_dedicated:
    print("\n2. 'Dedicated' pattern examples:")
    for i, p in enumerate(pattern_dedicated[:3]):
        print(f"   {i+1}. {p['name']}: {p['description']}")

if pattern_indoor:
    print("\n3. 'Indoor' pattern examples:")
    for i, p in enumerate(pattern_indoor[:3]):
        print(f"   {i+1}. {p['name']}: {p['description']}")

if pattern_dog_friendly:
    print("\n4. 'Dog-friendly' pattern examples:")
    for i, p in enumerate(pattern_dog_friendly[:3]):
        print(f"   {i+1}. {p['name']}: {p['description']}")

# Show longest descriptions
print("\n" + "="*60)
print("LONGEST DESCRIPTIONS")
print("="*60)
sorted_by_length = sorted(data, key=lambda x: len(x.get('description', '')), reverse=True)
for i, p in enumerate(sorted_by_length[:5]):
    print(f"\n{i+1}. {p['name']} ({len(p.get('description', ''))} chars):")
    print(f"   {p['description']}")

# Show shortest descriptions
print("\n" + "="*60)
print("SHORTEST DESCRIPTIONS")
print("="*60)
for i, p in enumerate(sorted_by_length[-5:]):
    print(f"\n{i+1}. {p['name']} ({len(p.get('description', ''))} chars):")
    print(f"   {p['description']}")

# Check for missing or empty descriptions
missing = [p for p in data if not p.get('description') or p.get('description').strip() == '']
if missing:
    print(f"\n⚠️  WARNING: {len(missing)} parks have missing or empty descriptions")
    for p in missing[:5]:
        print(f"   - {p['name']}")










