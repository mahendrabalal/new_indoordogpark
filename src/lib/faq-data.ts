import { FAQItem } from '@/types/faq';

export function buildDefaultFAQs(cityName: string, parkCount: number): FAQItem[] {
  const parkCountText =
    parkCount === 0
      ? `Our directory is actively expanding its verified listings for ${cityName}. While we continue to verify local dog parks, indoor facilities, and dog-friendly spots in ${cityName}, pet owners can explore nearby city listings or submit a local dog park to our platform.`
      : parkCount === 1
      ? `${cityName} currently features 1 verified dog park in our directory, offering a great space for your pup to exercise and socialize.`
      : `${cityName} currently features ${parkCount} verified dog parks and dog-friendly establishments, including traditional outdoor dog parks, indoor dog parks, and dog-friendly businesses like restaurants and shops.`;

  return [
    {
      question: `How many dog parks are available in ${cityName}?`,
      answer: `${parkCountText} Each facility offers unique benefits for different weather conditions and dog personalities.`,
      category: 'general',
      popular: true,
    },
    {
      question: `What are the best indoor dog parks in ${cityName}?`,
      answer:
        parkCount > 0
          ? `While our directory is constantly expanding, ${cityName} is a growing market for indoor dog parks. These climate-controlled spaces are essential for hot summers or rainy seasons. Check our directory and local listings to see what features to look for when choosing a facility in ${cityName}.`
          : `We are currently updating our verified list of indoor dog parks in ${cityName}. Indoor facilities provide essential climate-controlled spaces for hot summers or rainy seasons. If you know of or manage an indoor dog park in ${cityName}, you can submit it to our directory for review.`,
      category: 'facilities',
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














