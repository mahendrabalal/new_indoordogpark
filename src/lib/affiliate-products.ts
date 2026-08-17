export interface AffiliateProduct {
  slug: string;
  productName: string;
  brand: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  description: string;
  amazonUrl: string;
  priceRange?: string;
  features: string[];
  bestFor: string;
  imageUrl?: string;
}

export const AFFILIATE_PRODUCTS: Record<string, AffiliateProduct> = {
  'expert-gear-test-boss-dog-tactical-leash-4ft-green-camo-performance-review': {
    slug: 'expert-gear-test-boss-dog-tactical-leash-4ft-green-camo-performance-review',
    productName: 'Boss Dog Tactical Dog Leash (4ft Green Camo)',
    brand: 'Boss Tactical',
    badge: "Editor's Choice • Top Tactical Leash",
    rating: 4.9,
    reviewCount: 48,
    description: 'Military-grade tactical dog leash engineered with dual neoprene-padded control handles, zinc-alloy swivel clasp, and heavy-duty 2-ply nylon webbing.',
    amazonUrl: 'https://amzn.to/45ujV1p',
    priceRange: '$$',
    features: [
      'Dual Neoprene Padded Control Handles (Traffic & Standard)',
      'Aviation-Grade Zinc Alloy Swivel Clasp',
      'Heavy-Duty 2-Ply Weather-Resistant Nylon Webbing',
      'Tested for Pullers and High-Energy Dogs',
    ],
    bestFor: 'Large breeds, strong pullers, training facilities, and indoor dog park agility sessions.',
  },
  'in-depth-gear-review-crew-lala-fancy-fins-and-5ft-rope-dog-leashes': {
    slug: 'in-depth-gear-review-crew-lala-fancy-fins-and-5ft-rope-dog-leashes',
    productName: 'Crew LaLa 5ft Rope Dog Leash & Fancy Fins Set',
    brand: 'Crew LaLa',
    badge: 'Best Premium Rope Leash',
    rating: 4.8,
    reviewCount: 36,
    description: 'Handcrafted luxury 5ft marine-grade rope dog leash featuring solid brass hardware and whipped ends for maximum durability and comfort.',
    amazonUrl: 'https://www.amazon.com/s?k=crew+lala+5ft+rope+dog+leash&tag=mabalal06-20',
    priceRange: '$$$',
    features: [
      '100% Hand-Dyed Cotton Rope & Marine Finish',
      'Solid Brass 360-Degree Swivel Clasp',
      'Soft-on-Hands Grip (Zero Rope Burn)',
      'Reinforced Whipped Thread Splicing',
    ],
    bestFor: 'Everyday walks, social dog outings, and pet owners looking for designer durability.',
  },
  'the-ultimate-guide-to-the-everyday-yellow-nylon-dog-collar-durability-safety-and-hidden-meanings': {
    slug: 'the-ultimate-guide-to-the-everyday-yellow-nylon-dog-collar-durability-safety-and-hidden-meanings',
    productName: 'Everyday Heavy-Duty Yellow Nylon Dog Collar',
    brand: 'Everyday Pet',
    badge: 'Best High-Visibility Collar',
    rating: 4.8,
    reviewCount: 52,
    description: 'Bright yellow heavy-duty nylon dog collar designed for safety, maximum visibility, and signaling that your pup appreciates personal space.',
    amazonUrl: 'https://www.amazon.com/s?k=yellow+nylon+dog+collar&tag=mabalal06-20',
    priceRange: '$',
    features: [
      'High-Density Vibrant Yellow Nylon Webbing',
      'Quick-Release Heavy-Duty Buckle & Welded D-Ring',
      'Universal Visual Indicator for "I Need Space / Training"',
      'Weatherproof & Easy to Clean',
    ],
    bestFor: 'Dogs in training, nervous pups needing space, and high-visibility indoor/outdoor play.',
  },
  'bowsers-divine-futon-dog-bed-review-luxury-comfort-and-joint-support-tested': {
    slug: 'bowsers-divine-futon-dog-bed-review-luxury-comfort-and-joint-support-tested',
    productName: 'Bowsers Divine Futon Luxury Orthopedic Dog Bed',
    brand: 'Bowsers Pet Products',
    badge: 'Best Orthopedic Bed',
    rating: 4.9,
    reviewCount: 64,
    description: 'Premium orthopedic dog futon crafted with high-memory furniture foam, dual-bolster joint support, and machine-washable microvelvet upholstery.',
    amazonUrl: 'https://www.amazon.com/s?k=bowsers+divine+futon+dog+bed&tag=mabalal06-20',
    priceRange: '$$$',
    features: [
      'High-Memory Furniture-Grade Orthopedic Foam Base',
      'Zippered Removable & Machine-Washable Microvelvet Cover',
      'Superior Hip & Joint Pressure Relief for Senior Dogs',
      'Reversible Cushion for Extended Durability',
    ],
    bestFor: 'Post-play indoor recovery, senior dogs, and breeds prone to joint sensitivity.',
  },
  'acana-classics-dry-dog-food-salmon-and-barley-recipe-the-ultimate-nutritional-review': {
    slug: 'acana-classics-dry-dog-food-salmon-and-barley-recipe-the-ultimate-nutritional-review',
    productName: 'ACANA Classics Wild Coast Salmon & Pearled Barley Dry Food',
    brand: 'ACANA',
    badge: 'Top Nutrition Pick',
    rating: 4.9,
    reviewCount: 110,
    description: 'Biologically appropriate dry dog food crafted with 50% premium fish ingredients, farm-grown wholesome grains, and essential omega fatty acids.',
    amazonUrl: 'https://www.amazon.com/s?k=acana+classics+salmon+barley&tag=mabalal06-20',
    priceRange: '$$',
    features: [
      '50% Quality Fish Ingredients (Wild Salmon, Herring & Flounder)',
      'Wholesome Pearled Barley & Oats for Gut Health',
      'Rich in Omega-3 & 6 for Skin and Coat Radiance',
      'Zero Artificial Flavors, Colors, or Preservatives',
    ],
    bestFor: 'Active dogs, sensitive stomachs, and promoting healthy skin & shiny coats.',
  },
  'lucy-and-co-hands-free-rope-dog-leash-the-ultimate-review-for-active-pet-parents': {
    slug: 'lucy-and-co-hands-free-rope-dog-leash-the-ultimate-review-for-active-pet-parents',
    productName: 'Lucy & Co. Hands-Free Adjustable Rope Dog Leash',
    brand: 'Lucy & Co.',
    badge: 'Best Hands-Free Leash',
    rating: 4.8,
    reviewCount: 42,
    description: 'Multi-functional climbing rope leash with adjustable brass O-rings that can be worn crossbody, around the waist, or used as a standard hand leash.',
    amazonUrl: 'https://www.amazon.com/s?k=lucy+and+co+hands+free+rope+dog+leash&tag=mabalal06-20',
    priceRange: '$$',
    features: [
      'Versatile 3-in-1 Design: Crossbody, Waist, or Handheld',
      'Sturdy Weatherproof Climbing Rope Construction',
      'Heavy-Duty Solid Brass Hardware & Locking Clips',
      'Quick Adjustments on the Go',
    ],
    bestFor: 'Jogging, multi-tasking pet owners, and indoor dog park visits.',
  },
};

export function getAffiliateProduct(slug: string): AffiliateProduct | null {
  return AFFILIATE_PRODUCTS[slug] || null;
}
