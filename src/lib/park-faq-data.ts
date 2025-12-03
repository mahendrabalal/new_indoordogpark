import { FAQItem } from '@/types/faq';
import type { DogPark } from '@/types/dog-park';

/**
 * Build comprehensive default FAQs for park pages
 * These FAQs provide valuable information and improve SEO with FAQ schema
 */
export function buildParkFAQs(park: DogPark): FAQItem[] {
  const faqs: FAQItem[] = [
    {
      question: `What are the hours for ${park.name}?`,
      answer: park.openingHours && Object.keys(park.openingHours).length > 0
        ? `${park.name} is open ${Object.entries(park.openingHours)
            .map(([day, hours]) => `${day}: ${hours}`)
            .join(', ')}. Hours may vary on holidays, so we recommend contacting the park directly for the most current schedule.`
        : `Please contact ${park.name} directly for current hours of operation. Hours may vary by season and holidays. Our team keeps hours updated on Google Maps and the park's official website.`,
      category: 'general',
      popular: true,
    },
    {
      question: `Is ${park.name} free to use?`,
      answer: park.pricing?.isFree
        ? `${park.name} is free to use for all visitors.`
        : park.pricing?.pricingDetails
        ? `${park.name} pricing: ${park.pricing.pricingDetails}. For the most current pricing information, please contact the park directly or visit their website.`
        : `Please check with ${park.name} for current pricing information. Many indoor dog parks require membership fees or day passes, while outdoor parks may be free or require permits.`,
      category: 'pricing',
      popular: true,
    },
    {
      question: `What amenities are available at ${park.name}?`,
      answer: park.amenities
        ? `${park.name} offers ${Object.entries(park.amenities)
            .filter(([, value]) => value === true)
            .map(([key]) => formatAmenityForFAQ(key))
            .slice(0, 8)
            .join(', ')}. ${park.amenities.parking ? 'Parking is available on-site.' : 'Please check parking availability before visiting.'}`
        : `${park.name} offers various amenities for your furry friends. Contact the park or visit their website for a complete list of available facilities and features.`,
      category: 'facilities',
      popular: true,
    },
    {
      question: `What are the requirements to visit ${park.name}?`,
      answer: `Most dog parks require that your dog be current on vaccinations (rabies, DHPP), licensed, and well-behaved. ${park.businessType === 'Indoor Dog Park' ? 'Indoor facilities like ' + park.name + ' typically require proof of vaccinations, health certificates, or temperament assessments. ' : ''}Always check specific park rules before visiting, as requirements may vary.`,
      category: 'requirements',
    },
    {
      question: `Are there separate areas for small and large dogs at ${park.name}?`,
      answer: park.amenities?.smallDogArea && park.amenities?.largeDogArea
        ? `Yes! ${park.name} offers separate areas for small dogs (under 25 lbs) and large dogs (over 25 lbs) to ensure safe play experiences for all dogs.`
        : park.amenities?.smallDogArea
        ? `${park.name} has a dedicated small dog area for dogs under 25 lbs. Large dogs share the main area.`
        : park.amenities?.largeDogArea
        ? `${park.name} has a dedicated large dog area. Small dogs share the main area.`
        : `${park.name} uses a shared space for all dog sizes. Please supervise your dog's interactions and ensure they are comfortable in mixed-size environments.`,
      category: 'safety',
    },
    {
      question: `Can I bring multiple dogs to ${park.name}?`,
      answer: `Most parks welcome multiple dogs from the same household, but you must be able to control all dogs at once. Some facilities limit the number of dogs per person (usually 2-3). For safety, ensure you can give adequate attention to each dog and be prepared to leave if any dog becomes overwhelmed or aggressive.`,
      category: 'rules',
    },
    {
      question: `What should I bring when visiting ${park.name}?`,
      answer: `Essential items include: a leash (for entering and exiting), poop bags, fresh water and a bowl${park.amenities?.waterFountains ? ' (though water fountains are available)' : ''}, your dog's vaccination records (especially for indoor facilities), and your phone for emergencies. Optional items include toys (check park rules first), treats for training, and a first-aid kit.`,
      category: 'planning',
    },
    {
      question: `Are there similar dog parks near ${park.name}?`,
      answer: `Yes! There are other dog parks and dog-friendly facilities in ${park.city}. Explore our directory to discover nearby options with different amenities and features.`,
      category: 'general',
    },
  ];

  // Add business type specific FAQs
  if (park.businessType === 'Indoor Dog Park') {
    faqs.push({
      question: `What makes ${park.name} different from outdoor dog parks?`,
      answer: `${park.name} is an indoor facility, providing climate-controlled environments perfect for hot summers, rainy days, or dogs with weather sensitivities. Indoor facilities typically offer specialized flooring, agility equipment, training areas, and year-round access regardless of weather conditions.`,
      category: 'facilities',
    });
  }

  if (park.amenities?.agilityCourse) {
    faqs.push({
      question: `Does ${park.name} have agility equipment?`,
      answer: `Yes! ${park.name} features agility equipment and obstacle courses. This makes it an excellent choice for active dogs who enjoy physical challenges and mental stimulation.`,
      category: 'facilities',
    });
  }

  if (park.amenities?.swimming) {
    faqs.push({
      question: `Does ${park.name} have a swimming area?`,
      answer: `Yes! ${park.name} features a swimming area or pool. This is perfect for dogs who love water activities. Please supervise your dog around water and ensure they are comfortable swimming before allowing them in the water area.`,
      category: 'facilities',
    });
  }

  return faqs;
}

/**
 * Format amenity key names for human-readable FAQ text
 */
function formatAmenityForFAQ(key: string): string {
  const amenityMap: Record<string, string> = {
    parking: 'parking',
    waterFountains: 'water fountains',
    shade: 'shaded areas',
    seating: 'seating areas',
    smallDogArea: 'separate small dog area',
    largeDogArea: 'separate large dog area',
    agilityCourse: 'agility equipment',
    swimming: 'swimming area',
    dogWashStation: 'dog wash station',
    restrooms: 'restrooms',
    handicapAccess: 'handicap accessibility',
    lighting: 'evening lighting',
    fencing: 'secure fencing',
    grooming: 'grooming services',
    daycare: 'daycare services',
    training: 'training classes',
  };

  return amenityMap[key] || key.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
}

