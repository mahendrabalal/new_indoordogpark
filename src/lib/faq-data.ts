import { FAQItem } from '@/types/faq';

export function buildDefaultFAQs(cityName: string, parkCount: number): FAQItem[] {
  return [
    {
      question: `How many dog parks are available in ${cityName}?`,
      answer: `${cityName} has ${parkCount} dog parks and dog-friendly establishments, including traditional outdoor dog parks, indoor dog parks, and dog-friendly businesses like restaurants and shops. Each type offers unique benefits for different situations and dog personalities.`,
      category: 'general',
      popular: true,
    },
    {
      question: 'Are there any indoor dog parks in the USA?',
      answer:
        'Yes! The United States is home to hundreds of indoor dog parks, and the industry is growing rapidly. IndoorDogPark.org maintains the most comprehensive directory available, currently tracking over 360 verified facilities across 155 cities nationwide.\n\nThese climate-controlled spaces solve real problems for dog owners. In cities like Phoenix where summer temperatures can exceed 110°F, or Chicago where winter brings sub-zero temperatures for months, indoor parks become essential. They\'re also invaluable in rainy regions like Seattle or Portland, where outdoor parks stay muddy for much of the year.\n\nOur directory includes detailed profiles for each facility: amenities, pricing structures, operating hours, vaccination requirements, and real visitor experiences. We\'ve aggregated over 106,000 user reviews from Google, Yelp, and other platforms to help you make informed decisions.\n\nPopular metro areas with the most options include Los Angeles (23 indoor facilities), Chicago (18 facilities), and New York City (15 facilities). But we\'ve also documented smaller markets like Bend, Oregon, and Asheville, North Carolina, where innovative entrepreneurs are meeting local demand.\n\nTo explore options near you, visit our main directory page or browse by state. Each listing includes photos, direct contact information, and links to facility websites where you can check current availability and make reservations.',
      category: 'general',
      popular: true,
    },
    {
      question: `Are dog parks in ${cityName} free to use?`,
      answer:
        'Most traditional outdoor dog parks in public spaces are free to use. However, indoor dog parks and specialized facilities typically require membership fees or day passes. Dog-friendly establishments like restaurants may have minimum purchase requirements or special pet menus.',
      category: 'pricing',
      popular: true,
    },
    {
      question: `What are the requirements to visit dog parks in ${cityName}?`,
      answer:
        'Most dog parks require that your dog be current on vaccinations (rabies, DHPP), licensed, and well-behaved. Some indoor facilities may require proof of vaccinations, health certificates, or temperament assessments. Always check specific park rules before visiting.',
      category: 'requirements',
      popular: true,
    },
    {
      question: `What's the best time to visit dog parks in ${cityName}?`,
      answer:
        "Early mornings (6–9 AM) and early evenings (4–7 PM) are typically the busiest times, offering great socialization opportunities. Midday visits are usually quieter, better for dogs who may be overwhelmed by crowds. Weekends are generally busier than weekdays. Consider your dog's personality and social comfort level when planning visits.",
      category: 'planning',
      popular: true,
    },
    {
      question: 'Where to go with a dog when it\'s raining?',
      answer:
        'Rainy days don\'t have to mean canceled playtime. Indoor dog parks are specifically designed for exactly this scenario, offering climate-controlled environments where dogs can exercise and socialize safely.\n\nOur directory lists over 360 indoor facilities across the country. Many feature specialized surfaces like K9Grass or rubberized flooring that stay clean and dry regardless of weather. These surfaces are easier on joints than concrete and reduce injury risk compared to muddy outdoor parks.\n\nBeyond dedicated indoor parks, consider these alternatives:\n\n• Pet stores with play areas: Chains like PetSmart and Petco sometimes host indoor play sessions.\n• Dog-friendly cafes and restaurants: Many now welcome well-behaved dogs indoors, perfect for socialization in a calmer setting.\n• Indoor training facilities: Often open their spaces for play sessions between classes.\n• Doggy daycare centers: Many offer drop-in playtime options for non-members.\n\nPro tip: Indoor facilities get significantly busier during bad weather, so call ahead or book reservations when possible. Many also offer online booking systems for convenience.\n\nBonus: Most indoor parks include dog wash stations, so your pup can get clean before the ride home—no muddy paws in your car. Explore our directory to find indoor options near you, and filter by amenities like "dog wash" or "separate small dog areas" to find exactly what you need.',
      category: 'planning',
      popular: true,
    },
    {
      question: `Are there any size restrictions or separate areas for different sized dogs?`,
      answer: `Many dog parks in ${cityName} offer separate areas for small dogs (under 25 lbs) and large dogs (over 25 lbs). This helps ensure safe play experiences. However, not all parks have this separation, so it's important to check ahead and supervise your dog's interactions.`,
      category: 'safety',
    },
    {
      question: `What should I bring when visiting a dog park in ${cityName}?`,
      answer:
        "Essential items include: a leash (for entering and exiting), poop bags, fresh water and a bowl, your dog's vaccination records (especially for indoor facilities), and your phone for emergencies. Optional items include toys (check park rules first), treats for training, and a first-aid kit.",
      category: 'planning',
    },
    {
      question: `Are there indoor dog park options available in ${cityName}?`,
      answer: `Yes, ${cityName} offers indoor dog park facilities that provide climate-controlled environments perfect for hot summers, rainy days, or dogs with weather sensitivities. These facilities typically offer specialized flooring, agility equipment, and training areas. Most require membership or advance booking.`,
      category: 'facilities',
    },
    {
      question: 'What is the most dog friendly city in the USA?',
      answer:
        'This question sparks lively debates among dog owners, and the answer depends on what you value most. Based on our analysis of over 360 facilities across 155 cities, here\'s what the data reveals:\n\nCalifornia dominates in sheer numbers: Los Angeles, San Diego, and San Francisco collectively host 50+ indoor dog parks. But quantity isn\'t everything.\n\nCities consistently ranking high for overall dog-friendliness include:\n\n• San Francisco: Over 40% of households include dogs (above the 38% national average), extensive off-leash beaches, and one of the highest concentrations of dog parks per capita.\n\n• Portland, Oregon: Known for progressive pet policies, abundant green spaces, and a culture where dogs are welcome almost everywhere—including many restaurants and breweries.\n\n• Seattle: Over 14 off-leash areas plus multiple indoor facilities, making it ideal for a city that gets 150+ rainy days annually.\n\n• Austin, Texas: Boasts some of the largest dog parks in the country, plus a vibrant dog-friendly dining scene.\n\n• Denver: High altitude doesn\'t stop Coloradans—the city maintains excellent park facilities and welcoming policies.\n\nHowever, "friendliness" extends beyond park counts. Factors like pet-friendly rental policies, veterinary care access, breed restrictions, and community culture matter just as much.\n\nOur directory lets you explore by city to see specific offerings. Check out our city guides for detailed breakdowns of parks, amenities, and local pet policies. We also maintain guides for major metro areas on our blog, covering everything from best parks to dog-friendly neighborhoods.',
      category: 'general',
    },
    {
      question: 'What is the biggest dog park in the US?',
      answer:
        'The "biggest" title depends on how you measure: total acreage, enclosed play space, or number of separate areas. Here\'s what we\'ve found from analyzing parks nationwide:\n\nLargest outdoor parks by acreage:\n\n• Shawnee Mission Dog Park (Overland Park, Kansas): At 53 acres, this park is massive. It includes wooded trails, open fields, and a dedicated swimming lake. It\'s a true destination park worth traveling to.\n\n• Point Isabel Regional Shoreline (Richmond, California): 23 acres of waterfront parkland with stunning Bay Area views. It\'s one of the few parks with an attached dog wash facility and cafe.\n\n• Beneful Dream Dog Park (Nashville, Tennessee): 3 acres of purpose-built facilities, but it\'s the quality and variety that impresses—separate areas for different sizes, agility equipment, and water features.\n\nFor indoor facilities, size is measured differently. The largest indoor dog parks we\'ve documented typically range from 10,000 to 30,000 square feet of play space. Larger facilities often include:\n\n• Multiple play zones separated by size or activity level\n• Agility courses with professional-grade equipment\n• Separate training rooms\n• Doggy cafes or lounges for owners\n• Grooming and wash stations\n\nHowever, bigger isn\'t always better. Many dog owners prefer smaller, well-supervised facilities (5,000-10,000 sq ft) because they offer:\n\n• Better visibility for owners\n• More controlled socialization\n• Stronger community feel\n• Less overwhelming for anxious dogs\n\nSize considerations also depend on your dog. A 3,000 sq ft indoor park might feel huge to a Chihuahua but cramped to a Great Dane who needs room to run.\n\nOur directory lets you filter by facility features and read reviews from over 106,000 visitors. Many reviewers specifically mention space size and layout, helping you find the right fit for your dog\'s needs and personality.',
      category: 'facilities',
    },
    {
      question: `Can I bring multiple dogs to the park?`,
      answer:
        'Most parks welcome multiple dogs from the same household, but you must be able to control all dogs at once. Some facilities limit the number of dogs per person (usually 2-3). For safety, ensure you can give adequate attention to each dog and be prepared to leave if any dog becomes overwhelmed or aggressive.',
      category: 'rules',
    },
    {
      question: `What are the most common dog park rules in ${cityName}?`,
      answer:
        'Common rules include: dogs must be leashed when entering and exiting, owners must remain within the park and supervise their dogs at all times, aggressive dogs must be removed immediately, all waste must be picked up, and dogs should not be left unattended. Many parks also have rules about toys, food, and children.',
      category: 'rules',
    },
    {
      question: `Are there dog parks with special features like swimming areas or agility courses?`,
      answer: `Yes! Several dog parks in ${cityName} offer special features including swimming pools, agility equipment, obstacle courses, and training areas. Indoor facilities often have specialized equipment for training and exercise. Check individual park listings for specific amenities.`,
      category: 'facilities',
    },
    {
      question: `How do I know if a dog park is safe and well-maintained?`,
      answer:
        'Look for parks with regular maintenance schedules, secure fencing, double-gated entries, clean water sources, waste disposal stations, and visible rules postings. Online reviews and local dog owner groups can provide insights about park conditions and community experiences.',
      category: 'safety',
    },
    {
      question: `What should I do if my dog gets into a fight at the park?`,
      answer:
        'Immediately intervene by making a loud noise to distract the dogs, then separate them using leashes or objects (not your hands). Check both dogs for injuries and exchange contact information with the other owner. Leave the park to allow everyone to calm down. Report serious incidents to park management if applicable.',
      category: 'safety',
    },
    {
      question: `Are there any breed restrictions at ${cityName} dog parks?`,
      answer:
        `Most public dog parks in ${cityName} do not have breed-specific restrictions, focusing instead on individual dog behavior. However, some private facilities and indoor parks may have their own policies. Always check specific park requirements, especially for facilities requiring membership.`,
      category: 'requirements',
    },
    {
      question: `Can I host a dog birthday party or event at a dog park?`,
      answer:
        'Many dog parks allow small gatherings, but some may require permits for larger events. Indoor facilities often offer party packages and private rental options. Always check with park management first, be prepared to clean up thoroughly, and consider other park users who may be present.',
      category: 'events',
    },
    {
      question: `What training opportunities are available at dog parks in ${cityName}?`,
      answer:
        `Many dog parks in ${cityName} have professional trainers offering classes, or you can work on basic obedience and socialization skills yourself. Indoor facilities often provide structured training programs, agility classes, and behavior workshops. Dog parks are excellent environments for practicing recall and social skills under controlled conditions.`,
      category: 'training',
    },
  ];
}














