import { PriorityCityConfig } from '@/types/city-content';
import { FAQItem } from '@/types/faq';

const chicagoFaqs: FAQItem[] = [
  {
    question: 'Where can I walk my dog indoors in Chicago?',
    answer:
      'Start in the West Loop and River North where Bark Social Fulton Market, Urban Pooch, and coworking-friendly lounges layer turf fields with espresso bars. Many locations let you reserve climate-controlled play before or after a meeting.',
    category: 'facilities',
    popular: true,
  },
  {
    question: 'How do indoor dog park prices work in Chicago?',
    answer:
      'Expect $15–$25 weekday drop-ins, $35–$45 weekend peak sessions, and $95+ monthly memberships that bundle agility classes or coworking desks. Premium lounges add bar tabs or locker rentals.',
    category: 'pricing',
    popular: true,
  },
  {
    question: 'Are memberships worth it for downtown apartment dogs?',
    answer:
      'Yes—unlimited play tiers guarantee predictable schedules, guest passes, and priority access to private suites when the lakefront freezes. Most plans include two human passes so roommates or sitters can check in.',
    category: 'membership',
  },
  {
    question: 'Can I host a cowork-and-play session at Chicago indoor parks?',
    answer:
      'Spaces like Paws & Co. Lounge provide sound-proof phone booths, sit-stand desks, and concierge dog attendants so you can work from the park. Book weekday blocks online and bring proof of vaccinations and insurance if you are a vendor.',
    category: 'events',
  },
];

const minneapolisFaqs: FAQItem[] = [
  {
    question: 'Where can I walk my dog indoors in Minneapolis?',
    answer:
      'Unleashed Hounds & Hops, North Loop Agility Lab, and Powderhorn Play Studio keep pups moving during blizzards. Each space has turf, heated floors, and staff monitors so you can skip icy sidewalks.',
    category: 'facilities',
    popular: true,
  },
  {
    question: 'What do indoor dog parks cost in Minneapolis?',
    answer:
      'Drop-in passes average $14 on weekdays and $20 on weekends. Winter season passes run $189–$249 and include daycare credits plus climate-controlled enrichment classes.',
    category: 'pricing',
    popular: true,
  },
  {
    question: 'How do memberships handle extreme cold or snow days?',
    answer:
      'Most Minneapolis clubs guarantee indoor time slots even when schools close. You can hold daycare credits, schedule treadmill walks, or reserve the agility bay for your training goals.',
    category: 'membership',
  },
  {
    question: 'Do indoor parks pair with daycare or boarding add-ons?',
    answer:
      'Yes—Longfellow Canine Loft and Downtown Dayclub both stack play passes with daycare, heated transport, and even waxing services for snow-packed paws.',
    category: 'services',
  },
];

const portlandFaqs: FAQItem[] = [
  {
    question: 'Where can I walk my dog indoors in Portland?',
    answer:
      'Focus on warehouse conversions in Slabtown, Buckman, and the Central Eastside. Spots like Rain City Rovers and Sip & Stay Yard link indoor runs with brewery taps and food cart patios.',
    category: 'facilities',
    popular: true,
  },
  {
    question: 'How much do Portland indoor dog parks cost?',
    answer:
      'Expect $18–$25 drop-ins that include a pint or coffee credit, plus $110–$150 monthly memberships that unlock event rentals and late-night rain plans.',
    category: 'pricing',
    popular: true,
  },
  {
    question: 'Do memberships include brewery or event perks?',
    answer:
      'Yes—many Portland operators partner with craft beverage clubs so you can earn bar tabs, reserve private taproom yards, or host fundraisers with built-in beverage minimums.',
    category: 'membership',
  },
  {
    question: 'Can I rent the space for parties or breed meetups?',
    answer:
      'Indoor parks like Pearl Pack Pavilion provide projector-ready lounges, catering-friendly kitchens, and sound systems. Submit event dates 2–3 weeks ahead for staff and cleanup scheduling.',
    category: 'events',
  },
];

const columbusFaqs: FAQItem[] = [
  {
    question: 'Where can I walk my dog indoors in Columbus, Ohio?',
    answer:
      'Short North Social Club, Campus Canine Commons, and Easton Enrichment Lab provide turf, climate control, and student-friendly lounge seating when the weather swings.',
    category: 'facilities',
    popular: true,
  },
  {
    question: 'How do indoor dog park prices work near Ohio State?',
    answer:
      'Drop-ins hover around $16, while semester memberships range from $120–$180 and include tutoring lounge access, study nooks, or daycare bundles.',
    category: 'pricing',
    popular: true,
  },
  {
    question: 'Can I combine daycare, boarding, and indoor play?',
    answer:
      'Yes—Easton Enrichment Lab and German Village Loft both bundle overnight boarding, enrichment labs, and daytime play so busy students or medical staff can keep consistent routines.',
    category: 'membership',
  },
  {
    question: 'Are there membership perks for college students?',
    answer:
      'Many Columbus hubs include roommate guest passes, finals-week late hours, and discounted wellness pop-ups. Upload your student ID to unlock the campus tier.',
    category: 'services',
  },
];

const phoenixFaqs: FAQItem[] = [
  {
    question: 'Where can I walk my dog indoors in Phoenix?',
    answer:
      'Heat-wave locals head to Desert Dog Dome, Arcadia Climate Club, and Chandler Chill Barn for air-conditioned turf, misting corridors, and splash pads.',
    category: 'facilities',
    popular: true,
  },
  {
    question: 'How much do indoor dog parks cost during summer in Phoenix?',
    answer:
      'Expect $20 weekday drop-ins, $30 weekend heat-wave sessions, and $140 memberships that include cool-down towel service, ice treats, and app-based waitlists.',
    category: 'pricing',
    popular: true,
  },
  {
    question: 'Can I reserve spots when the temperature spikes?',
    answer:
      'Yes—clubs like Valley Pack Lounge open a weather alert waitlist. Members get push notifications and can lock two-hour windows before public sales.',
    category: 'membership',
  },
  {
    question: 'Do these parks offer daycare or shuttle service?',
    answer:
      'Many Phoenix operators offer climate-controlled transport vans, daycare add-ons, and cooling vest rentals so dogs arrive safely even when it hits 110°F.',
    category: 'services',
  },
];

const lasVegasFaqs: FAQItem[] = [
  {
    question: 'Where can I walk my dog indoors in Las Vegas?',
    answer:
      'Check Downtown Core Playhouse, Summerlin Stay & Play, and Strip-side Bark Suites for climate-controlled runs tied to resorts, condos, and high-rise rentals.',
    category: 'facilities',
    popular: true,
  },
  {
    question: 'How does pricing work for Las Vegas indoor dog parks?',
    answer:
      'Most spots sell $22 day passes, $35 tourist drop-ins with gear rentals, and $150 monthly memberships that include late checkout or concierge walk service.',
    category: 'pricing',
    popular: true,
  },
  {
    question: 'Do indoor parks partner with hotels or Airbnbs?',
    answer:
      'Yes—operators like Neon Fetch Collective team up with resort concierges so visitors can book playtime, daycare, or grooming between shows. Ask for the hotel guest code for swift onboarding.',
    category: 'membership',
  },
  {
    question: 'Can I schedule flexible drop-ins for travel days?',
    answer:
      'Vegas parks typically offer hourly reservations, luggage storage, and rideshare lounges so you can pop in between flights or conferences.',
    category: 'services',
  },
];

const austinFaqs: FAQItem[] = [
  {
    question: 'Where can I walk my dog indoors in Austin?',
    answer:
      'South Austin, East Austin, and the Domain area host climate-controlled indoor dog parks like Bark & Brew Austin, Yard Bar, and indoor agility facilities. Many combine play spaces with coffee shops, breweries, or coworking lounges perfect for Austin\'s tech-friendly culture.',
    category: 'facilities',
    popular: true,
  },
  {
    question: 'How much do indoor dog parks cost in Austin?',
    answer:
      'Expect $18–$25 weekday drop-ins, $25–$35 weekend sessions, and $120–$180 monthly memberships. Many Austin parks bundle playtime with craft beer, coffee, or event space rentals. Tech company partnerships often unlock corporate discounts.',
    category: 'pricing',
    popular: true,
  },
  {
    question: 'Are indoor parks essential during Austin summers?',
    answer:
      'Yes—when temperatures hit 100°F+, indoor parks with AC become essential for safe play. Most Austin facilities run heat alerts, offer cooling stations, and prioritize members during extreme weather. Some parks even partner with local pools for combo packages.',
    category: 'membership',
  },
  {
    question: 'Do Austin indoor parks offer tech-friendly amenities?',
    answer:
      'Many Austin indoor parks cater to remote workers with Wi-Fi, charging stations, quiet coworking zones, and flexible hourly passes. Some locations host tech meetups, startup events, or offer corporate membership tiers for local companies.',
    category: 'services',
  },
];

const newYorkFaqs: FAQItem[] = [
  {
    question: 'Where can I walk my dog indoors in New York City?',
    answer:
      'Manhattan, Brooklyn, and Queens host indoor dog parks in converted warehouses, high-rise amenity spaces, and dedicated facilities. Many NYC indoor parks are located in apartment buildings or commercial spaces, offering climate-controlled play year-round.',
    category: 'facilities',
    popular: true,
  },
  {
    question: 'How much do indoor dog parks cost in NYC?',
    answer:
      'Expect $25–$35 drop-ins, $40–$50 weekend sessions, and $150–$250 monthly memberships. NYC indoor parks often include amenities like grooming, training classes, and event space access. Some offer building resident discounts.',
    category: 'pricing',
    popular: true,
  },
  {
    question: 'Do NYC indoor parks require reservations?',
    answer:
      'Yes—most NYC indoor parks require advance reservations due to limited space and high demand. Members typically get priority booking. Walk-ins are often available but subject to capacity.',
    category: 'membership',
  },
  {
    question: 'Are there indoor parks in Manhattan?',
    answer:
      'Yes, though they\'re less common than in outer boroughs. Manhattan indoor parks are often located in apartment buildings, converted commercial spaces, or dedicated facilities. Brooklyn and Queens tend to have more standalone indoor dog park facilities.',
    category: 'services',
  },
];

const houstonFaqs: FAQItem[] = [
  {
    question: 'Where can I walk my dog indoors in Houston?',
    answer:
      'Houston indoor dog parks are found throughout the metro area, with concentrations in the Heights, Montrose, and suburban areas. Many combine indoor play with outdoor areas and offer climate control for Houston\'s hot, humid summers.',
    category: 'facilities',
    popular: true,
  },
  {
    question: 'How much do indoor dog parks cost in Houston?',
    answer:
      'Expect $18–$25 weekday drop-ins, $25–$30 weekend sessions, and $120–$160 monthly memberships. Houston parks often include amenities like splash pads, cooling stations, and extended hours during summer heat waves.',
    category: 'pricing',
    popular: true,
  },
  {
    question: 'Are indoor parks essential during Houston summers?',
    answer:
      'Yes—Houston\'s extreme heat and humidity make indoor parks essential for safe play during summer months. Most facilities offer premium AC, cooling stations, and heat alert systems to keep dogs comfortable.',
    category: 'membership',
  },
  {
    question: 'Do Houston indoor parks offer daycare services?',
    answer:
      'Many Houston indoor parks combine play facilities with daycare, boarding, and grooming services. This makes them convenient one-stop destinations for busy pet parents in the metro area.',
    category: 'services',
  },
];

const seattleFaqs: FAQItem[] = [
  {
    question: 'Where can I walk my dog indoors in Seattle?',
    answer:
      'Seattle indoor dog parks are found in neighborhoods like Capitol Hill, Ballard, and South Lake Union. Many combine indoor play with outdoor areas and offer year-round climate control for Seattle\'s rainy winters.',
    category: 'facilities',
    popular: true,
  },
  {
    question: 'How much do indoor dog parks cost in Seattle?',
    answer:
      'Expect $20–$28 weekday drop-ins, $25–$35 weekend sessions, and $130–$180 monthly memberships. Seattle parks often include amenities like coffee bars, craft beer, and event space for the city\'s active dog community.',
    category: 'pricing',
    popular: true,
  },
  {
    question: 'Are indoor parks popular during Seattle winters?',
    answer:
      'Yes—Seattle\'s rainy winters make indoor parks popular year-round. Many facilities offer extended hours and special programs during the wet season. Some parks partner with local breweries and cafes.',
    category: 'membership',
  },
  {
    question: 'Do Seattle indoor parks offer training classes?',
    answer:
      'Many Seattle indoor parks offer training classes, agility courses, and enrichment programs. The city\'s active dog community values structured activities alongside free play time.',
    category: 'services',
  },
];

const santaAnaFaqs: FAQItem[] = [
  {
    question: 'Where can I take my dog in Santa Ana, CA?',
    answer:
      'Santa Ana sits in the heart of Orange County, so most dog families mix local neighborhood parks with quick drives to nearby Costa Mesa, Tustin, and Irvine. Use this page to browse verified listings as we refresh our directory weekly.',
    category: 'general',
    popular: true,
  },
  {
    question: 'Are there indoor dog park options available in Santa Ana?',
    answer:
      'Not yet in our verified directory for Santa Ana. If you know a great indoor option, you can submit it and we’ll review it for inclusion.',
    category: 'facilities',
    popular: true,
  },
  {
    question: 'What should I bring when visiting dog parks in Santa Ana?',
    answer:
      'Bring a leash for entry/exit control, waste bags, fresh water + a bowl, and high-value treats. For warmer months, add paw protection (hot pavement) and a cooling towel—especially for midday outings.',
    category: 'planning',
  },
  {
    question: 'What are the best times to visit dog parks in Santa Ana?',
    answer:
      'Early mornings and evenings are usually the most comfortable (cooler temps) and most social. Midday can be quieter but hotter—choose shaded parks, bring extra water, and shorten play sessions if it’s warm.',
    category: 'planning',
  },
];

export const priorityCityContent: PriorityCityConfig[] = [
  {
    slug: 'chicago-il',
    city: 'Chicago',
    state: 'IL',
    featuredImage: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Dense downtown population + apartment amenities; perfect for combo pay-to-play memberships and coworking-friendly lounges.',
    parks: [
      {
        id: 'chi-urban-pooch',
        name: 'Urban Pooch Indoor Playground',
        businessType: 'Indoor Dog Park',
        description:
          'Two-level Ravenswood playground with turf sprint lanes, a quiet coworking mezzanine, and concierge bath service so downtown apartment pups burn energy before you log into meetings.',
        slug: 'priority-chicago-urban-pooch',
        address: '5400 N Damen Ave',
        street: '5400 N Damen Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60625',
        full_address: '5400 N Damen Ave, Chicago, IL 60625',
        latitude: 41.9809,
        longitude: -87.6793,
        phone: '(773) 942-9263',
        website: 'https://www.urbanpooch.com',
        rating: 4.8,
        reviewCount: 312,
        pricing: {
          isFree: false,
          pricingType: 'membership',
          dropInFee: 22,
          priceRange: '$$',
          pricingDetails: 'Weekday drop-ins plus unlimited cowork memberships.',
        },
        openingHours: {
          Monday: '7:00 AM – 9:00 PM',
          Tuesday: '7:00 AM – 9:00 PM',
          Wednesday: '7:00 AM – 9:00 PM',
          Thursday: '7:00 AM – 9:00 PM',
          Friday: '7:00 AM – 10:00 PM',
          Saturday: '8:00 AM – 10:00 PM',
          Sunday: '8:00 AM – 8:00 PM',
        },
        amenities: {
          parking: true,
          waterFountains: true,
          shade: true,
          seating: true,
          agilityCourse: true,
          grooming: true,
          daycare: true,
          training: true,
          socializing: true,
          restrooms: true,
        },
        indoorOutdoor: 'indoor',
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1518378188025-22bd89516ee2?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
            caption: 'Chicago indoor playground with skyline murals.',
          },
        ],
        listingType: 'featured',
        source: 'static',
        dataQuality: 'verified',
      },
      {
        id: 'chi-bark-social',
        name: 'Bark Social Fulton Market',
        businessType: 'Indoor Dog Park',
        description:
          'A pay-to-play lounge tucked between independent coffee roasters with pour-over service, skyline views, and late-night DJ sets for apartment dwellers who need climate-proof play.',
        slug: 'priority-chicago-bark-social',
        address: '949 W Fulton Market',
        street: '949 W Fulton Market',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60607',
        full_address: '949 W Fulton Market, Chicago, IL 60607',
        latitude: 41.8864,
        longitude: -87.6513,
        website: 'https://www.barksocial.com',
        rating: 4.7,
        reviewCount: 268,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 24,
          priceRange: '$$',
          pricingDetails: 'Includes craft beverage credit and locker rental.',
        },
        openingHours: {
          Monday: '8:00 AM – 11:00 PM',
          Tuesday: '8:00 AM – 11:00 PM',
          Wednesday: '8:00 AM – 11:00 PM',
          Thursday: '8:00 AM – 12:00 AM',
          Friday: '8:00 AM – 12:00 AM',
          Saturday: '9:00 AM – 12:00 AM',
          Sunday: '9:00 AM – 10:00 PM',
        },
        amenities: {
          seating: true,
          agilityCourse: true,
          dogWashStation: true,
          restrooms: true,
          lighting: true,
          grooming: true,
          training: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        listingType: 'free',
        source: 'static',
      },
      {
        id: 'chi-paws-co',
        name: 'Paws & Co Coworking Lounge',
        businessType: 'Indoor Dog Park',
        description:
          'River North concept that splits the floorplan between monitored play pods and reservable work suites complete with espresso, lockers, and video conference booths.',
        slug: 'priority-chicago-paws-co',
        address: '215 W Hubbard St',
        street: '215 W Hubbard St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60654',
        full_address: '215 W Hubbard St, Chicago, IL 60654',
        latitude: 41.8909,
        longitude: -87.6344,
        website: 'https://www.pawsandcochi.com',
        rating: 4.9,
        reviewCount: 198,
        pricing: {
          isFree: false,
          pricingType: 'membership',
          dropInFee: 30,
          priceRange: '$$$',
          pricingDetails: 'Unlimited cowork lounge access + evening play blocks.',
        },
        amenities: {
          seating: true,
          parking: false,
          agilityCourse: true,
          daycare: true,
          training: true,
          restrooms: true,
          waterFountains: true,
        },
        openingHours: {
          Monday: '6:00 AM – 10:00 PM',
          Tuesday: '6:00 AM – 10:00 PM',
          Wednesday: '6:00 AM – 10:00 PM',
          Thursday: '6:00 AM – 10:00 PM',
          Friday: '6:00 AM – 11:00 PM',
          Saturday: '7:00 AM – 11:00 PM',
          Sunday: '7:00 AM – 9:00 PM',
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
            caption: 'Work lounge overlooking the indoor run.',
          },
        ],
        indoorOutdoor: 'indoor',
        listingType: 'featured',
        source: 'static',
      },
      {
        id: 'chi-lakeview-lab',
        name: 'Lakeview Loft Play Lab',
        businessType: 'Indoor Dog Park',
        description:
          'Second-story loft with rubberized agility floors, scent work workshops, and rooftop relief turf for Lakeview and Lincoln Park condo dwellers.',
        slug: 'priority-chicago-lakeview-loft',
        address: '3224 N Clark St',
        street: '3224 N Clark St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60657',
        full_address: '3224 N Clark St, Chicago, IL 60657',
        latitude: 41.9402,
        longitude: -87.6527,
        website: 'https://www.lakeviewloftdogs.com',
        rating: 4.6,
        reviewCount: 154,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 18,
          priceRange: '$$',
        },
        amenities: {
          seating: true,
          agilityCourse: true,
          training: true,
          daycare: true,
          dogWashStation: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
    ],
    customContent: {
      heroEyebrow: 'Indoor play x coworking',
      heroHeading: 'Indoor dog park in Chicago',
      heroDescription:
        'Dense downtown population + apartment amenities make Chicago perfect for modern indoor dog parks that mix pay-to-play passes with coworking-friendly lounges.',
      heroPill: 'Cowork-ready lounges',
      heroFootnotes: ['Loop, River North & Bucktown coverage', 'Drop-ins, memberships, and concierge hosts'],
      heroChips: [
        { label: 'Indoor-only hubs', value: '12+' },
        { label: 'Late-night sessions', value: 'Until midnight' },
      ],
      insightIntro:
        'Indoor dog parks keep apartment pups moving when the Lakefront Trail is icy. Expect concierge hosts, espresso bars, and pre-booked play pods layered into luxury towers.',
      insightCards: [
        {
          tag: 'Downtown density',
          title: 'Coworking-friendly lounges',
          copy: 'Most Chicago indoor parks pair climate control with hotline Wi-Fi and booth seating so Loop professionals can extend the workday without skipping enrichment.',
          accent: true,
        },
        {
          tag: 'Membership mix',
          title: 'Flexible pay-to-play',
          copy: 'Operators lead with $20–$30 drop-ins but upsell unlimited passes that include bath service, lockers, and guest privileges for roommates.',
        },
        {
          tag: 'Neighborhood focus',
          title: 'River North + West Loop',
          copy: 'Converted warehouses anchor the scene, keeping transit, parking, and rooftop relief breaks within a five-minute walk of high-rise elevators.',
        },
      ],
      planningCards: [
        {
          icon: 'bi-briefcase',
          title: 'Cowork + play blueprint',
          items: ['Reserve a lounge desk via the park app', 'Arrive 15 min early for behavior check-in', 'Book a shower or concierge walk before happy hour'],
        },
        {
          icon: 'bi-calendar-event',
          title: 'Peak windows',
          items: ['7–9 AM pre-office sprint clubs', 'Noon express potty break with staff monitors', '8–11 PM lounge scene for service industry workers'],
        },
        {
          icon: 'bi-door-open',
          title: 'Building requirements',
          items: ['Upload vaccination + renter insurance docs once', 'Bring grip socks for turf mezzanines', 'Plan for elevator leashes & double-gated entries'],
        },
      ],
      mapSidebarNote:
        'Prioritize Fulton Market, River North, and Lakeview markers for fast access to parking garages, CTA stations, and cowork-friendly lounges.',
      faqs: chicagoFaqs,
      faqSupportCard: {
        kicker: 'Indoor founders',
        title: 'Franchise-ready Chicago brief',
        description: 'Download demand curves, density maps, and membership benchmarks for launching an indoor dog park franchise in Chicago.',
        primary: { label: 'Get owner guide', href: '/owner-resources' },
        secondary: { label: 'Book a strategy call', href: '/contact' },
        footnote: 'Includes coworking lounge specs + pay-to-play pricing templates.',
      },
      ownerCta: {
        kicker: 'Franchise & owners',
        title: 'Launch the next Chicago indoor dog park',
        description:
          'Use our indoor demand data to size your West Loop or River North footprint, build cowork memberships, and pre-sell concierge services before opening day.',
        primary: { label: 'Download owner playbook', href: '/owner-resources' },
        secondary: { label: 'Talk to our team', href: '/contact' },
        footnote: 'Perfect for brokers converting vacant retail or amenity floors.',
      },
    },
  },
  {
    slug: 'minneapolis-mn',
    city: 'Minneapolis',
    state: 'MN',
    featuredImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Long winter season and high dog ownership make climate-controlled agility courses and daycare add-ons a fast win.',
    parks: [
      {
        id: 'msp-unleashed-hops',
        name: 'Unleashed Hounds & Hops',
        businessType: 'Indoor Dog Park',
        description:
          'North Loop staple combining a 10,000-square-foot indoor run, heated patio, and craft taplist so winter social plans never pause.',
        slug: 'priority-msp-unleashed-hops',
        address: '200 E Lyndale Ave N',
        street: '200 E Lyndale Ave N',
        city: 'Minneapolis',
        state: 'MN',
        zipCode: '55405',
        full_address: '200 E Lyndale Ave N, Minneapolis, MN 55405',
        latitude: 44.9891,
        longitude: -93.2827,
        phone: '(612) 886-1281',
        website: 'https://www.unleashedhoundsandhops.com',
        rating: 4.7,
        reviewCount: 422,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 16,
          priceRange: '$$',
        },
        indoorOutdoor: 'indoor',
        amenities: {
          seating: true,
          agilityCourse: true,
          smallDogArea: true,
          largeDogArea: true,
          restrooms: true,
          socializing: true,
        },
        openingHours: {
          Monday: '10:00 AM – 10:00 PM',
          Tuesday: '10:00 AM – 10:00 PM',
          Wednesday: '10:00 AM – 11:00 PM',
          Thursday: '10:00 AM – 11:00 PM',
          Friday: '10:00 AM – 12:00 AM',
          Saturday: '9:00 AM – 12:00 AM',
          Sunday: '9:00 AM – 10:00 PM',
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1518378188025-22bd89516ee2?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        listingType: 'featured',
        source: 'static',
      },
      {
        id: 'msp-agility-lab',
        name: 'North Loop Agility Lab',
        businessType: 'Indoor Dog Park',
        description:
          'Structured training warehouse with climate-controlled turf, A-frame rigs, and a mezzanine lounge for handlers escaping lake-effect winds.',
        slug: 'priority-msp-agility-lab',
        address: '315 1st Ave N',
        street: '315 1st Ave N',
        city: 'Minneapolis',
        state: 'MN',
        zipCode: '55401',
        full_address: '315 1st Ave N, Minneapolis, MN 55401',
        latitude: 44.9849,
        longitude: -93.2727,
        website: 'https://www.northloopagility.com',
        rating: 4.8,
        reviewCount: 210,
        pricing: {
          isFree: false,
          pricingType: 'membership',
          dropInFee: 20,
          priceRange: '$$',
        },
        amenities: {
          agilityCourse: true,
          training: true,
          parking: true,
          waterFountains: true,
        },
        openingHours: {
          Monday: '8:00 AM – 9:00 PM',
          Tuesday: '8:00 AM – 9:00 PM',
          Wednesday: '8:00 AM – 9:00 PM',
          Thursday: '8:00 AM – 9:00 PM',
          Friday: '8:00 AM – 9:00 PM',
          Saturday: '9:00 AM – 8:00 PM',
          Sunday: '9:00 AM – 8:00 PM',
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
      {
        id: 'msp-downtown-dayclub',
        name: 'Downtown Dayclub & Lounge',
        businessType: 'Indoor Dog Park',
        description:
          'Skyway-connected lounge with enrichment treadmills, sauna-style drying rooms, and barista service for hybrid workers.',
        slug: 'priority-msp-dayclub',
        address: '50 S 6th St',
        street: '50 S 6th St',
        city: 'Minneapolis',
        state: 'MN',
        zipCode: '55402',
        full_address: '50 S 6th St, Minneapolis, MN 55402',
        latitude: 44.9771,
        longitude: -93.2728,
        website: 'https://www.downtowndayclub.com',
        rating: 4.6,
        reviewCount: 176,
        pricing: {
          isFree: false,
          pricingType: 'membership',
          dropInFee: 25,
          priceRange: '$$$',
        },
        amenities: {
          seating: true,
          daycare: true,
          grooming: true,
          training: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1518021967252-3def6c5a2830?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        listingType: 'featured',
        source: 'static',
      },
      {
        id: 'msp-longfellow-loft',
        name: 'Longfellow Canine Loft',
        businessType: 'Indoor Dog Park',
        description:
          'South Minneapolis daycare hybrid with heated swim spa, snow-melt entryways, and neighborhood pickup vans for frigid days.',
        slug: 'priority-msp-longfellow',
        address: '3300 E Lake St',
        street: '3300 E Lake St',
        city: 'Minneapolis',
        state: 'MN',
        zipCode: '55406',
        full_address: '3300 E Lake St, Minneapolis, MN 55406',
        latitude: 44.9486,
        longitude: -93.2223,
        website: 'https://www.longfellowcanineloft.com',
        rating: 4.5,
        reviewCount: 138,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 18,
          priceRange: '$$',
        },
        amenities: {
          swimming: true,
          daycare: true,
          grooming: true,
          training: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1510337550647-e84f83e341ca?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
    ],
    customContent: {
      heroEyebrow: 'Winter-proof indoor loops',
      heroHeading: 'Indoor dog park in Minneapolis',
      heroDescription:
        'Long winters and high dog ownership make climate-controlled agility courses, daycare add-ons, and taproom partnerships the default hangout for Minneapolis pet parents.',
      heroPill: 'Blizzard-safe turf',
      heroFootnotes: ['Skyway + North Loop connectors', 'Season passes w/ daycare credits'],
      heroChips: [
        { label: 'Climate-ready hubs', value: '10+' },
        { label: 'Average temp relief', value: 'Heat + humidity control' },
      ],
      insightIntro:
        'When sidewalks ice over, indoor parks anchor community life. Minneapolis hubs double as agility gyms, daycare waystations, and social clubs with local beer on tap.',
      insightCards: [
        {
          tag: 'Snow season demand',
          title: 'Booked-out evenings',
          copy: 'Prime 4–8 PM windows sell out weeks ahead once temps dip below 20°F. Lock recurring reservations through the member portal.',
          accent: true,
        },
        {
          tag: 'Hybrid services',
          title: 'Daycare + shuttles',
          copy: 'Operators layer climate-controlled vans, treadmills, and sauna-style drying rooms so dogs never touch slush.',
        },
        {
          tag: 'Community perks',
          title: 'Taproom tie-ins',
          copy: 'North Loop venues bundle beer flights, trivia nights, and rescue fundraisers to keep humans hanging around after play.',
        },
      ],
      planningCards: [
        {
          icon: 'bi-cloud-snow',
          title: 'Weather plan',
          items: ['Book indoor slots before snow alerts', 'Pack a quick-dry towel + boots', 'Use lobby dryers before rideshare pickups'],
        },
        {
          icon: 'bi-calendar-week',
          title: 'Membership cadence',
          items: ['Mix daytime daycare with evening play', 'Trade unused credits for agility classes', 'Share guest passes with neighbors'],
        },
        {
          icon: 'bi-house-door',
          title: 'Neighborhood focus',
          items: ['North Loop for skyway access', 'Longfellow for bungalow pickup routes', 'St. Louis Park for suburban commuters'],
        },
      ],
      mapSidebarNote:
        'Pin North Loop, Downtown, and Longfellow markers to balance skyway access, parking, and shuttle pickups during snow.',
      faqs: minneapolisFaqs,
      faqSupportCard: {
        kicker: 'Owner resources',
        title: 'Winter operations toolkit',
        description: 'Grab SOPs for snow days, shuttle routing, and heated entryways before you launch a Minneapolis indoor park.',
        primary: { label: 'Download toolkit', href: '/owner-resources' },
        secondary: { label: 'Chat with our team', href: '/contact' },
      },
      ownerCta: {
        kicker: 'Franchise & owners',
        title: 'Open a Minneapolis indoor dog park',
        description:
          'Pair agility labs with daycare and shuttle service to capture peak winter demand. We provide density maps, staffing ratios, and pricing benchmarks.',
        primary: { label: 'Get the owner guide', href: '/owner-resources' },
        secondary: { label: 'Book a planning call', href: '/contact' },
      },
    },
  },
  {
    slug: 'portland-or',
    city: 'Portland',
    state: 'OR',
    featuredImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    summary: 'Rainy climate + craft beverage culture: highlight brewery partnerships and event rentals.',
    parks: [
      {
        id: 'pdx-rain-city-rovers',
        name: 'Rain City Rovers',
        businessType: 'Indoor Dog Park',
        description:
          'Central Eastside warehouse strung with skylights, kombucha taps, and rentable event pods so rainy afternoons still feel celebratory.',
        slug: 'priority-pdx-rain-city',
        address: '110 SE Salmon St',
        street: '110 SE Salmon St',
        city: 'Portland',
        state: 'OR',
        zipCode: '97214',
        full_address: '110 SE Salmon St, Portland, OR 97214',
        latitude: 45.5127,
        longitude: -122.6636,
        website: 'https://www.raincityrovers.com',
        rating: 4.7,
        reviewCount: 182,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 20,
          priceRange: '$$',
        },
        amenities: {
          seating: true,
          agilityCourse: true,
          restrooms: true,
          socializing: true,
          dogWashStation: true,
        },
        indoorOutdoor: 'indoor',
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        source: 'static',
      },
      {
        id: 'pdx-sip-stay',
        name: 'Sip & Stay Yard',
        businessType: 'Indoor Dog Park',
        description:
          'Slabtown taproom with retractable walls, hazy IPAs, and staff monitors so you can host brewery playdates rain or shine.',
        slug: 'priority-pdx-sip-stay',
        address: '1625 NW 21st Ave',
        street: '1625 NW 21st Ave',
        city: 'Portland',
        state: 'OR',
        zipCode: '97209',
        full_address: '1625 NW 21st Ave, Portland, OR 97209',
        latitude: 45.5336,
        longitude: -122.6953,
        website: 'https://www.sipandstayyard.com',
        rating: 4.6,
        reviewCount: 143,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 22,
          priceRange: '$$',
        },
        amenities: {
          seating: true,
          waterFountains: true,
          agilityCourse: true,
          socializing: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
      {
        id: 'pdx-pearl-pack',
        name: 'Pearl Pack Pavilion',
        businessType: 'Indoor Dog Park',
        description:
          'Pearl District pavilion with gallery lighting, rentable stages, and partnerships with local chefs for brunch pop-ups.',
        slug: 'priority-pdx-pearl-pack',
        address: '1215 NW Marshall St',
        street: '1215 NW Marshall St',
        city: 'Portland',
        state: 'OR',
        zipCode: '97209',
        full_address: '1215 NW Marshall St, Portland, OR 97209',
        latitude: 45.5304,
        longitude: -122.6854,
        website: 'https://www.pearlpackpavilion.com',
        rating: 4.8,
        reviewCount: 120,
        pricing: {
          isFree: false,
          pricingType: 'membership',
          dropInFee: 24,
          priceRange: '$$$',
        },
        amenities: {
          seating: true,
          training: true,
          agilityCourse: true,
          events: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
      {
        id: 'pdx-easton-collective',
        name: 'Eastbank Enrichment Collective',
        businessType: 'Indoor Dog Park',
        description:
          'Buckman studio built for agility teams—think rubber flooring, scent work labs, and livestream-ready lighting for competitions.',
        slug: 'priority-pdx-eastbank',
        address: '75 SE Alder St',
        street: '75 SE Alder St',
        city: 'Portland',
        state: 'OR',
        zipCode: '97214',
        full_address: '75 SE Alder St, Portland, OR 97214',
        latitude: 45.5191,
        longitude: -122.6645,
        website: 'https://www.eastbankdogs.com',
        rating: 4.5,
        reviewCount: 132,
        pricing: {
          isFree: false,
          pricingType: 'membership',
          dropInFee: 19,
          priceRange: '$$',
        },
        amenities: {
          agilityCourse: true,
          training: true,
          socializing: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1477973770766-6228305816df?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
    ],
    customContent: {
      heroEyebrow: 'Rain-or-shine playgrounds',
      heroHeading: 'Indoor dog park in Portland',
      heroDescription:
        'Rainy climate + craft beverage culture means Portland indoor dog parks lean on brewery partnerships, event rentals, and artful warehouse conversions.',
      heroPill: 'Brewery partners welcome',
      heroFootnotes: ['Slabtown · Central Eastside · Pearl'],
      heroChips: [
        { label: 'Brewery collabs', value: '15+' },
        { label: 'Private rentals', value: 'Book in-app' },
      ],
      insightIntro:
        'From kombucha flights to chef pop-ups, Portland indoor parks double as event venues. Expect natural light, sustainable materials, and staff that embrace rainy day creativity.',
      insightCards: [
        {
          tag: 'Craft culture',
          title: 'Taproom tie-ins',
          copy: 'Operators swap beer credits for membership perks, so every indoor session comes with a pint, coffee, or food cart voucher.',
        },
        {
          tag: 'Event-ready',
          title: 'Rentable stages',
          copy: 'Studios include AV, catering kitchens, and permit support for adoption drives, product launches, and community fundraisers.',
        },
        {
          tag: 'Weatherproof design',
          title: 'Skylights & retractable walls',
          copy: 'Natural light keeps indoor turf bright while retractable walls open when the drizzle lets up.',
          accent: true,
        },
      ],
      planningCards: [
        {
          icon: 'bi-cloud-rain',
          title: 'Rain plan essentials',
          items: ['Reserve in advance on stormy weekends', 'Pack quick-dry towels + slip-proof shoes', 'Use onsite dryers before heading back to the car'],
        },
        {
          icon: 'bi-emoji-smile',
          title: 'Social hour',
          items: ['Arrive early for beverage service', 'Respect brewery dog rules (no table paws)', 'Tip bar + cleanup teams—they flip spaces fast'],
        },
        {
          icon: 'bi-building',
          title: 'Event rentals',
          items: ['Submit permit requests 3 weeks out', 'Coordinate with preferred caterers', 'Add donation drives for rescue partners'],
        },
      ],
      mapSidebarNote:
        'Plot a loop: Pearl for polished rentals, Slabtown for breweries, and Central Eastside for agility labs.',
      faqs: portlandFaqs,
      faqSupportCard: {
        kicker: 'Need indoor venue specs?',
        title: 'Download the Portland rain-play kit',
        description: 'Get layouts, drainage guides, and brewery partnership templates ready for investor decks.',
        primary: { label: 'Grab the kit', href: '/owner-resources' },
        secondary: { label: 'Talk partnerships', href: '/contact' },
      },
      ownerCta: {
        kicker: 'Franchise & owners',
        title: 'Build a Portland indoor dog park',
        description:
          'Leverage brewery collabs, retractable walls, and event-ready lighting to keep membership calendars full all rainy season long.',
        primary: { label: 'Download owner playbook', href: '/owner-resources' },
        secondary: { label: 'Schedule a consult', href: '/contact' },
      },
    },
  },
  {
    slug: 'columbus-oh',
    city: 'Columbus',
    state: 'OH',
    featuredImage: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=1600&q=80',
    summary:
      'College-town audience searching for memberships and combined daycare/boarding packages.',
    parks: [
      {
        id: 'cmh-short-north',
        name: 'Short North Social Club',
        businessType: 'Indoor Dog Park',
        description:
          'Color-drenched membership club with study pods, latte service, and staff handlers so students can log library hours nearby.',
        slug: 'priority-cmh-short-north',
        address: '25 E 5th Ave',
        street: '25 E 5th Ave',
        city: 'Columbus',
        state: 'OH',
        zipCode: '43201',
        full_address: '25 E 5th Ave, Columbus, OH 43201',
        latitude: 39.9897,
        longitude: -83.0053,
        website: 'https://www.shortnorthsocialclub.com',
        rating: 4.7,
        reviewCount: 156,
        pricing: {
          isFree: false,
          pricingType: 'membership',
          dropInFee: 17,
          priceRange: '$$',
        },
        indoorOutdoor: 'indoor',
        amenities: {
          seating: true,
          training: true,
          daycare: true,
          socializing: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        source: 'static',
      },
      {
        id: 'cmh-campus-commons',
        name: 'Campus Canine Commons',
        businessType: 'Indoor Dog Park',
        description:
          'Half-mile from Ohio State with climate-controlled turf, finals-week quiet hours, and late-night dorm shuttles.',
        slug: 'priority-cmh-campus',
        address: '2010 N High St',
        street: '2010 N High St',
        city: 'Columbus',
        state: 'OH',
        zipCode: '43201',
        full_address: '2010 N High St, Columbus, OH 43201',
        latitude: 40.0046,
        longitude: -83.0099,
        website: 'https://www.campuscaninecommons.com',
        rating: 4.6,
        reviewCount: 190,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 16,
          priceRange: '$$',
        },
        amenities: {
          seating: true,
          agilityCourse: true,
          daycare: true,
          training: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
      {
        id: 'cmh-easton-lab',
        name: 'Easton Enrichment Lab',
        businessType: 'Indoor Dog Park',
        description:
          'Airport-area facility combining boarding suites, scent work, and livestream cameras for traveling medical staff and consultants.',
        slug: 'priority-cmh-easton',
        address: '4040 Easton Station',
        street: '4040 Easton Station',
        city: 'Columbus',
        state: 'OH',
        zipCode: '43219',
        full_address: '4040 Easton Station, Columbus, OH 43219',
        latitude: 40.0512,
        longitude: -82.9148,
        website: 'https://www.eastonenrichmentlab.com',
        rating: 4.8,
        reviewCount: 142,
        pricing: {
          isFree: false,
          pricingType: 'membership',
          dropInFee: 20,
          priceRange: '$$$',
        },
        amenities: {
          daycare: true,
          boarding: true,
          grooming: true,
          training: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
      {
        id: 'cmh-german-village',
        name: 'German Village Loft',
        businessType: 'Indoor Dog Park',
        description:
          'Historic brick loft with daybeds, retail, and member kitchen for neighbors who pair daycare with boutique boarding.',
        slug: 'priority-cmh-german-village',
        address: '541 S 3rd St',
        street: '541 S 3rd St',
        city: 'Columbus',
        state: 'OH',
        zipCode: '43215',
        full_address: '541 S 3rd St, Columbus, OH 43215',
        latitude: 39.9515,
        longitude: -82.9934,
        website: 'https://www.germanvillageloft.com',
        rating: 4.5,
        reviewCount: 118,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 18,
          priceRange: '$$',
        },
        amenities: {
          seating: true,
          daycare: true,
          grooming: true,
          socializing: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
    ],
    customContent: {
      heroEyebrow: 'Campus-friendly indoor runs',
      heroHeading: 'Indoor dog park in Columbus, Ohio',
      heroDescription:
        'College-town schedules crave memberships and combined daycare/boarding packages so students, med staff, and tech workers can keep a steady indoor routine.',
      heroPill: 'Study-friendly lounges',
      heroFootnotes: ['Short North · Campus · Easton'],
      insightIntro:
        'Operators lean into semester memberships, finals-week quiet hours, and roommate guest passes. Expect livestream cameras, group study pods, and late-night drop-offs.',
      insightCards: [
        {
          tag: 'Student demand',
          title: 'Semester memberships',
          copy: 'Auto-billed plans include finals-week late hours and study pod reservations so dogs stay active while roommates handle labs.',
        },
        {
          tag: 'Care pro schedules',
          title: 'Board + play bundles',
          copy: 'Medical staff bundle daycare, boarding, and ride-share pickups around Easton and Short North hubs.',
        },
        {
          tag: 'Community vibe',
          title: 'Pop-up markets',
          copy: 'Weekend maker markets and rescue adoption fairs keep the indoor scene lively even during shoulder seasons.',
        },
      ],
      planningCards: [
        {
          icon: 'bi-lightbulb',
          title: 'Semester checklist',
          items: ['Upload vaccination + student ID once', 'Share guest passes with roommates', 'Reserve finals quiet hours early'],
        },
        {
          icon: 'bi-bus-front',
          title: 'Transport tips',
          items: ['Use shuttle pick-ups near dorms', 'Schedule midday relief walks via app', 'Set up key locker for sitters'],
        },
        {
          icon: 'bi-bag',
          title: 'Weekend combos',
          items: ['Pair indoor sessions with North Market brunch', 'Book sniffari add-ons before hiking at Scioto Grove', 'Host club fundraisers inside climate control'],
        },
      ],
      mapSidebarNote:
        'Plot Short North for student perks, Campus for shuttles, Easton for pro travelers, and German Village for boutique boarding.',
      faqs: columbusFaqs,
      faqSupportCard: {
        kicker: 'Grow your membership',
        title: 'Download the Columbus campus kit',
        description: 'We packaged semester pricing templates, shuttle scripts, and fundraising playbooks to keep indoor calendars full.',
        primary: { label: 'Get the kit', href: '/owner-resources' },
        secondary: { label: 'Ask a strategist', href: '/contact' },
      },
      ownerCta: {
        kicker: 'Franchise & owners',
        title: 'Open a Columbus indoor dog park',
        description:
          'Blend semester passes, daycare bundles, and livestream amenities to win over students and hospital staff. We provide market data and launch roadmaps.',
        primary: { label: 'Download playbook', href: '/owner-resources' },
        secondary: { label: 'Book a consult', href: '/contact' },
      },
    },
  },
  {
    slug: 'phoenix',
    city: 'Phoenix',
    state: 'AZ',
    featuredImage: 'https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Peak search volume in summer—pair landing page with heat alerts and membership waitlist CTAs.',
    parks: [],
    customContent: {
      heroEyebrow: 'Heat-wave ready clubs',
      heroHeading: 'Indoor dog park in Phoenix',
      heroDescription:
        'Peak search volume hits each summer, so Phoenix indoor dog parks lean on heat alerts, mist tunnels, and membership waitlists that open when temps soar.',
      heroPill: 'Heat alert waitlists',
      heroFootnotes: ['Arcadia · Downtown · East Valley'],
      heroChips: [
        { label: 'Heat index triggers', value: 'Push alerts at 95°F' },
        { label: 'Cooling perks', value: 'Ice treats + towel service' },
      ],
      insightIntro:
        'Climate control is non-negotiable. Operators invest in redundancy: generators, mist corridors, and chilled turf so dogs sprint safely even at 110°F.',
      insightCards: [
        {
          tag: 'Summer surge',
          title: 'Membership waitlists',
          copy: 'When the forecast breaks triple digits, clubs prioritize members via push alerts and reserved time slots.',
          accent: true,
        },
        {
          tag: 'Cooling perks',
          title: 'Hydration suites',
          copy: 'Expect ice bath stations, towel service, and electrolyte treats bundled into premium tiers.',
        },
        {
          tag: 'Safety ops',
          title: 'Backup power',
          copy: 'Facilities publish HVAC redundancy and vet tech staffing so pet parents trust the indoor experience.',
        },
      ],
      planningCards: [
        {
          icon: 'bi-thermometer-high',
          title: 'Heat strategy',
          items: ['Join alert list in May', 'Pack booties for hot sidewalks', 'Schedule shuttle pickups during peak sun'],
        },
        {
          icon: 'bi-watch',
          title: 'Time blocks',
          items: ['Early morning 6–9 AM for training', 'Indoor lunch breaks for remote workers', 'Late-night cooldowns after sunset'],
        },
        {
          icon: 'bi-gear',
          title: 'Gear to bring',
          items: ['Cooling vest or bandana', 'Vaccination proof (required for shuttles)', 'Portable fan for car transfers'],
        },
      ],
      mapSidebarNote:
        'Plot Arcadia + Downtown for quick office detours, then add Chandler for East Valley families needing splash pads.',
      faqs: phoenixFaqs,
      faqSupportCard: {
        kicker: 'Heat-play operators',
        title: 'Download the Phoenix heat protocol kit',
        description: 'We bundled HVAC specs, misting diagrams, and alert scripts for owners launching indoor parks in the Valley.',
        primary: { label: 'Get the heat kit', href: '/owner-resources' },
        secondary: { label: 'Book a safety review', href: '/contact' },
      },
      ownerCta: {
        kicker: 'Franchise & owners',
        title: 'Launch a Phoenix indoor dog park',
        description:
          'Pair cooling tech with memberships and waitlists to capture heat-wave demand. Use our projections to size your footprint and staffing.',
        primary: { label: 'Download owner playbook', href: '/owner-resources' },
        secondary: { label: 'Talk to strategy', href: '/contact' },
      },
    },
  },
  {
    slug: 'las-vegas-nv',
    city: 'Las Vegas',
    state: 'NV',
    featuredImage: 'https://images.unsplash.com/photo-1469478715127-2f8a72700288?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Tourist-heavy demand for flexible drop-ins during extreme heat; cross-promote with hotels and pet-friendly Airbnbs.',
    parks: [
      {
        id: 'lvs-neon-fetch',
        name: 'Neon Fetch Collective',
        businessType: 'Indoor Dog Park',
        description:
          'Arts District flagship partnering with boutique hotels so travelers can drop dogs at a neon-lit lounge between shows.',
        slug: 'priority-lvs-neon-fetch',
        address: '1328 S Main St',
        street: '1328 S Main St',
        city: 'Las Vegas',
        state: 'NV',
        zipCode: '89104',
        full_address: '1328 S Main St, Las Vegas, NV 89104',
        latitude: 36.1591,
        longitude: -115.1532,
        website: 'https://www.neonfetch.com',
        rating: 4.7,
        reviewCount: 188,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 22,
          priceRange: '$$',
        },
        indoorOutdoor: 'indoor',
        amenities: {
          seating: true,
          daycare: true,
          grooming: true,
          socializing: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        source: 'static',
      },
      {
        id: 'lvs-summerlin-stay',
        name: 'Summerlin Stay & Play',
        businessType: 'Indoor Dog Park',
        description:
          'Suburban indoor/outdoor hybrid with cabanas, splash pads, and concierge chauffeurs for golf resort guests.',
        slug: 'priority-lvs-summerlin',
        address: '1880 Festival Plaza Dr',
        street: '1880 Festival Plaza Dr',
        city: 'Las Vegas',
        state: 'NV',
        zipCode: '89135',
        full_address: '1880 Festival Plaza Dr, Las Vegas, NV 89135',
        latitude: 36.1603,
        longitude: -115.3334,
        website: 'https://www.summerlinstayandplay.com',
        rating: 4.6,
        reviewCount: 144,
        pricing: {
          isFree: false,
          pricingType: 'membership',
          dropInFee: 24,
          priceRange: '$$$',
        },
        amenities: {
          swimming: true,
          daycare: true,
          grooming: true,
          boarding: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
      {
        id: 'lvs-strip-suite',
        name: 'Strip-Side Bark Suites',
        businessType: 'Indoor Dog Park',
        description:
          'Connected to a mid-Strip resort with 24/7 attendants, luggage storage, and shuttle loops to pet-friendly hotels.',
        slug: 'priority-lvs-strip-suite',
        address: '3595 S Las Vegas Blvd',
        street: '3595 S Las Vegas Blvd',
        city: 'Las Vegas',
        state: 'NV',
        zipCode: '89109',
        full_address: '3595 S Las Vegas Blvd, Las Vegas, NV 89109',
        latitude: 36.1179,
        longitude: -115.1720,
        website: 'https://www.stripsidebarksuites.com',
        rating: 4.5,
        reviewCount: 165,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 30,
          priceRange: '$$$',
        },
        amenities: {
          seating: true,
          daycare: true,
          grooming: true,
          socializing: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
      {
        id: 'lvs-downtown-core',
        name: 'Downtown Core Playhouse',
        businessType: 'Indoor Dog Park',
        description:
          'Freemont Street loft with flexible passes, cowork desks, and night-shift passes for hospitality staff.',
        slug: 'priority-lvs-downtown-core',
        address: '707 Fremont St',
        street: '707 Fremont St',
        city: 'Las Vegas',
        state: 'NV',
        zipCode: '89101',
        full_address: '707 Fremont St, Las Vegas, NV 89101',
        latitude: 36.1706,
        longitude: -115.1364,
        website: 'https://www.downtowncoreplayhouse.com',
        rating: 4.6,
        reviewCount: 130,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 21,
          priceRange: '$$',
        },
        amenities: {
          seating: true,
          daycare: true,
          training: true,
          socializing: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
    ],
    customContent: {
      heroEyebrow: 'Resort-friendly indoor runs',
      heroHeading: 'Indoor dog park in Las Vegas',
      heroDescription:
        'Tourist-heavy demand means Las Vegas indoor dog parks focus on flexible drop-ins, hotel partnerships, and concierge crews ready for extreme heat.',
      heroPill: 'Hotel partner passes',
      heroFootnotes: ['Arts District · Strip · Summerlin'],
      heroChips: [
        { label: 'Hotel partners', value: '25+ concierge desks' },
        { label: '24/7 options', value: 'Night-shift friendly' },
      ],
      insightIntro:
        'Vegas indoor parks run around the clock. Expect luggage storage, rideshare lounges, and staff that can communicate with resort concierges in minutes.',
      insightCards: [
        {
          tag: 'Visitor intent',
          title: 'Flexible drop-ins',
          copy: 'Hourly passes, gear rentals, and package storage cater to travelers between check-in and flights.',
          accent: true,
        },
        {
          tag: 'Hospitality partners',
          title: 'Concierge integrations',
          copy: 'Operators sync calendars with Strip hotels and Airbnb hosts for seamless referrals.',
        },
        {
          tag: 'Extreme heat',
          title: 'Cooling & shuttles',
          copy: 'Expect black car partners, mist tunnels, and overnight boarding for 105°F nights.',
        },
      ],
      planningCards: [
        {
          icon: 'bi-luggage',
          title: 'Travel day tips',
          items: ['Book an hourly locker for luggage', 'Use resort guest code for quick onboarding', 'Confirm shuttle pickup zones after midnight'],
        },
        {
          icon: 'bi-clock-history',
          title: 'Late-night schedule',
          items: ['Downtown Core stays open past 2 AM', 'Strip-side suites run 24/7', 'Summerlin cabanas open at sunrise'],
        },
        {
          icon: 'bi-building',
          title: 'Partner playbook',
          items: ['Ask hotel concierge for referral perks', 'Link membership to Airbnb stay', 'Bundle grooming before shows'],
        },
      ],
      mapSidebarNote:
        'Use the map to toggle Strip, Arts District, and Summerlin markers depending on whether you need tourist drop-ins or resident memberships.',
      faqs: lasVegasFaqs,
      faqSupportCard: {
        kicker: 'Owner partnerships',
        title: 'Las Vegas hospitality kit',
        description: 'Download concierge scripts, referral tracking sheets, and heat-readiness checklists before pitching resorts.',
        primary: { label: 'Get the kit', href: '/owner-resources' },
        secondary: { label: 'Book a partner call', href: '/contact' },
      },
      ownerCta: {
        kicker: 'Franchise & owners',
        title: 'Open a Las Vegas indoor dog park',
        description:
          'Blend resort partnerships, flexible drop-ins, and concierge convenience to capture tourist and local demand. We provide pricing benchmarks & hospitality playbooks.',
        primary: { label: 'Download owner guide', href: '/owner-resources' },
        secondary: { label: 'Chat with our team', href: '/contact' },
      },
    },
  },
  {
    slug: 'austin',
    city: 'Austin',
    state: 'TX',
    featuredImage: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Tech hub + extreme summer heat: indoor parks with AC, coworking spaces, and heat alerts are essential for Austin dog families.',
    parks: [],
    customContent: {
      heroEyebrow: 'Heat-proof indoor runs',
      heroHeading: 'Indoor dog park in Austin',
      heroDescription:
        'Tech hub culture meets extreme summer heat—Austin indoor dog parks combine AC, coworking spaces, and heat alerts so your pup stays active even when temps hit 100°F+.',
      heroPill: 'Tech-friendly lounges',
      heroFootnotes: ['South Austin · East Austin · Domain'],
      heroChips: [
        { label: 'Heat alert system', value: 'Active at 95°F+' },
        { label: 'Coworking zones', value: 'Wi-Fi included' },
      ],
      insightIntro:
        'When Austin summers peak, indoor parks become essential. Operators invest in premium AC, cooling stations, and tech-friendly amenities to serve remote workers and apartment dogs.',
      insightCards: [
        {
          tag: 'Summer demand',
          title: 'Heat alert waitlists',
          copy: 'When forecasts break 100°F, clubs prioritize members via push alerts and reserved time slots. Book early during heat waves.',
          accent: true,
        },
        {
          tag: 'Tech culture',
          title: 'Coworking integration',
          copy: 'Many Austin parks include Wi-Fi, charging stations, and quiet zones so remote workers can extend the workday without skipping enrichment.',
        },
        {
          tag: 'Brewery partnerships',
          title: 'Play + craft beer',
          copy: 'South and East Austin spots bundle indoor play with local brewery taps, creating social hubs that work for both dogs and humans.',
        },
      ],
      planningCards: [
        {
          icon: 'bi-thermometer-high',
          title: 'Heat strategy',
          items: ['Join heat alert lists in May', 'Pack booties for hot sidewalks', 'Schedule indoor sessions during peak sun hours (11 AM–4 PM)'],
        },
        {
          icon: 'bi-laptop',
          title: 'Remote work setup',
          items: ['Reserve coworking pods via app', 'Arrive early for best Wi-Fi spots', 'Book hourly passes for flexible schedules'],
        },
        {
          icon: 'bi-geo-alt',
          title: 'Neighborhood focus',
          items: ['South Austin for brewery combos', 'Domain for tech company perks', 'East Austin for hip, casual vibes'],
        },
      ],
      mapSidebarNote:
        'Prioritize South Austin, East Austin, and Domain markers for quick access to AC, coworking zones, and heat relief during summer months.',
      faqs: austinFaqs,
      faqSupportCard: {
        kicker: 'Heat-play operators',
        title: 'Download the Austin heat protocol kit',
        description: 'We bundled HVAC specs, cooling station diagrams, and heat alert scripts for owners launching indoor parks in Austin.',
        primary: { label: 'Get the heat kit', href: '/owner-resources' },
        secondary: { label: 'Book a safety review', href: '/contact' },
      },
      ownerCta: {
        kicker: 'Franchise & owners',
        title: 'Launch an Austin indoor dog park',
        description:
          'Pair premium AC with coworking spaces and heat alerts to capture summer demand. Use our projections to size your footprint and tech-friendly amenities.',
        primary: { label: 'Download owner playbook', href: '/owner-resources' },
        secondary: { label: 'Talk to strategy', href: '/contact' },
      },
    },
  },
  {
    slug: 'new-york',
    city: 'New York',
    state: 'NY',
    featuredImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Dense urban environment + year-round demand: indoor parks in converted spaces, high-rise amenities, and dedicated facilities serve NYC dog families.',
    parks: [],
    customContent: {
      heroEyebrow: 'Urban indoor runs',
      heroHeading: 'Indoor dog park in New York City',
      heroDescription:
        'Dense urban environment and year-round demand make NYC indoor dog parks essential. From converted warehouses to high-rise amenity spaces, indoor facilities serve Manhattan, Brooklyn, and Queens dog families.',
      heroPill: 'Reservation-based access',
      heroFootnotes: ['Manhattan · Brooklyn · Queens'],
      heroChips: [
        { label: 'Reservation system', value: 'Required for most' },
        { label: 'Building amenities', value: 'Apartment access' },
      ],
      insightIntro:
        'NYC indoor parks operate in premium real estate, requiring reservations and often offering building resident discounts. Expect converted commercial spaces, high-rise amenities, and dedicated facilities.',
      insightCards: [
        {
          tag: 'Urban density',
          title: 'Space at a premium',
          copy: 'NYC indoor parks require advance reservations due to limited space. Members get priority booking and often access to building amenities.',
          accent: true,
        },
        {
          tag: 'Year-round demand',
          title: 'Climate-controlled essential',
          copy: 'Indoor parks serve NYC dog families year-round, from hot summers to cold winters. Many facilities offer extended hours and special programs.',
        },
        {
          tag: 'Premium amenities',
          title: 'Full-service facilities',
          copy: 'Many NYC indoor parks combine play areas with grooming, training classes, and event space. Building residents often receive discounted access.',
        },
      ],
      planningCards: [
        {
          icon: 'bi-calendar-check',
          title: 'Reservation essentials',
          items: ['Book in advance via app or website', 'Members get priority time slots', 'Walk-ins subject to capacity'],
        },
        {
          icon: 'bi-building',
          title: 'Building access',
          items: ['Check if your building has indoor park access', 'Ask about resident discounts', 'Verify vaccination requirements'],
        },
        {
          icon: 'bi-geo-alt',
          title: 'Neighborhood focus',
          items: ['Manhattan: Limited but premium options', 'Brooklyn: More standalone facilities', 'Queens: Growing indoor park scene'],
        },
      ],
      mapSidebarNote:
        'Use the map to find indoor parks near your neighborhood. Manhattan options are limited but premium; Brooklyn and Queens offer more variety.',
      faqs: newYorkFaqs,
      faqSupportCard: {
        kicker: 'NYC operators',
        title: 'Download the NYC urban park kit',
        description: 'We bundled space optimization guides, reservation system templates, and building partnership scripts for NYC indoor park operators.',
        primary: { label: 'Get the kit', href: '/owner-resources' },
        secondary: { label: 'Book a consult', href: '/contact' },
      },
      ownerCta: {
        kicker: 'Franchise & owners',
        title: 'Launch a NYC indoor dog park',
        description:
          'Navigate NYC real estate to launch an indoor dog park. We provide space optimization strategies, reservation system templates, and building partnership playbooks.',
        primary: { label: 'Download owner playbook', href: '/owner-resources' },
        secondary: { label: 'Talk to strategy', href: '/contact' },
      },
    },
  },
  {
    slug: 'santa-ana',
    city: 'Santa Ana',
    state: 'CA',
    featuredImage: 'https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Orange County hub with year-round outdoor play—use early/late windows, and lean on shaded parks during warm afternoons.',
    parks: [],
    customContent: {
      heroEyebrow: 'Orange County spotlight',
      heroHeading: 'Dog Parks in Santa Ana, CA',
      heroDescription:
        'Plan your next dog outing in Santa Ana with neighborhood-friendly parks and nearby Orange County favorites. Our directory refreshes weekly—submit a spot to help us verify more listings.',
      heroPill: 'OC dog-friendly picks',
      heroFootnotes: ['Data refreshed weekly', 'Submit a park to help us verify more locations'],
      heroChips: [
        { label: 'Verified parks', value: '—', caption: 'In review' },
        { label: 'Indoor coverage', value: '—', caption: 'Being scouted' },
        { label: 'Nearby cities', value: 'Tustin · Irvine · Costa Mesa' },
      ],
      insightIntro:
        'Santa Ana dog families often rotate between local parks and nearby Orange County neighborhoods depending on shade, crowd levels, and weekend events.',
      insightCards: [
        {
          tag: 'Warm weather',
          title: 'Pick shaded windows',
          copy: 'Aim for early mornings or after 4 PM for cooler temps. Midday sessions work best at shaded parks with water nearby.',
          accent: true,
        },
        {
          tag: 'OC access',
          title: 'Short drives unlock variety',
          copy: 'If a park is crowded, nearby Costa Mesa, Tustin, and Irvine add more options without a long commute.',
        },
        {
          tag: 'Safety basics',
          title: 'Hydration + supervision',
          copy: 'Bring water, scan the park before entering, and step in early if play gets too intense—especially with mixed sizes.',
        },
      ],
      planningCards: [
        {
          icon: 'bi-clock',
          title: 'Best time blocks',
          items: ['6–9 AM: peak social window', '10 AM–3 PM weekdays: quieter (watch heat)', 'After 4 PM: cooler + after-work crowd'],
        },
        {
          icon: 'bi-bag',
          title: 'Essentials checklist',
          items: ['Leash + harness', 'Waste bags', 'Fresh water + bowl', 'Cooling towel in warm months'],
        },
        {
          icon: 'bi-shield-check',
          title: 'Quick safety tips',
          items: ['Avoid crowded gates—wait your turn', 'Remove prong collars before play', 'Leave early if your dog is stressed'],
        },
      ],
      mapSidebarNote:
        'Use the map to compare nearby neighborhoods—toggle categories to find the vibe that fits (training, social, or quick exercise).',
      faqs: santaAnaFaqs,
      ownerCta: {
        kicker: 'Park owners',
        title: 'List your Santa Ana dog-friendly business',
        description:
          'Own a dog-friendly business or manage a play facility in Santa Ana? Submit your listing to get verified and show up when local pet parents search.',
        primary: { label: 'List your park', href: '/list-your-park' },
        secondary: { label: 'Contact us', href: '/contact' },
        footnote: 'We review submissions and refresh city pages weekly.',
      },
    },
  },
  {
    slug: 'houston',
    city: 'Houston',
    state: 'TX',
    featuredImage: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Extreme summer heat + sprawling metro: indoor parks with premium AC, cooling stations, and extended summer hours serve Houston dog families.',
    parks: [],
    customContent: {
      heroEyebrow: 'Heat-proof indoor runs',
      heroHeading: 'Indoor dog park in Houston',
      heroDescription:
        'Extreme summer heat and sprawling metro area make Houston indoor dog parks essential. Premium AC, cooling stations, and extended summer hours keep dogs active safely year-round.',
      heroPill: 'Summer heat relief',
      heroFootnotes: ['Heights · Montrose · Suburbs'],
      heroChips: [
        { label: 'Heat alert system', value: 'Active at 90°F+' },
        { label: 'Cooling stations', value: 'Premium AC' },
      ],
      insightIntro:
        'Houston\'s extreme heat and humidity make indoor parks essential during summer months. Operators invest in premium climate control, cooling stations, and heat alert systems.',
      insightCards: [
        {
          tag: 'Summer demand',
          title: 'Heat wave essential',
          copy: 'When temperatures hit 95°F+, indoor parks become essential for safe play. Most facilities offer extended hours and prioritize members during extreme weather.',
          accent: true,
        },
        {
          tag: 'Full-service options',
          title: 'Daycare + play',
          copy: 'Many Houston indoor parks combine play facilities with daycare, boarding, and grooming services, making them convenient one-stop destinations.',
        },
        {
          tag: 'Metro coverage',
          title: 'Sprawling access',
          copy: 'Indoor parks are found throughout the Houston metro area, with concentrations in the Heights, Montrose, and suburban communities.',
        },
      ],
      planningCards: [
        {
          icon: 'bi-thermometer-high',
          title: 'Heat strategy',
          items: ['Join heat alert lists in April', 'Pack cooling gear for transitions', 'Schedule indoor sessions during peak heat (11 AM–6 PM)'],
        },
        {
          icon: 'bi-clock-history',
          title: 'Summer hours',
          items: ['Many parks extend hours during heat waves', 'Members get priority booking', 'Check for special summer programs'],
        },
        {
          icon: 'bi-geo-alt',
          title: 'Neighborhood focus',
          items: ['Heights: Central location with amenities', 'Montrose: Urban, walkable options', 'Suburbs: Family-friendly facilities'],
        },
      ],
      mapSidebarNote:
        'Prioritize Heights, Montrose, and suburban markers for quick access to premium AC and cooling stations during Houston summers.',
      faqs: houstonFaqs,
      faqSupportCard: {
        kicker: 'Heat-play operators',
        title: 'Download the Houston heat protocol kit',
        description: 'We bundled HVAC specs, cooling station diagrams, and heat alert scripts for owners launching indoor parks in Houston.',
        primary: { label: 'Get the heat kit', href: '/owner-resources' },
        secondary: { label: 'Book a safety review', href: '/contact' },
      },
      ownerCta: {
        kicker: 'Franchise & owners',
        title: 'Launch a Houston indoor dog park',
        description:
          'Pair premium AC with cooling stations and heat alerts to capture summer demand. Use our projections to size your footprint and climate control systems.',
        primary: { label: 'Download owner playbook', href: '/owner-resources' },
        secondary: { label: 'Talk to strategy', href: '/contact' },
      },
    },
  },
  {
    slug: 'seattle',
    city: 'Seattle',
    state: 'WA',
    featuredImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Rainy winters + active dog community: indoor parks with year-round climate control, training classes, and craft beverage partnerships serve Seattle dog families.',
    parks: [],
    customContent: {
      heroEyebrow: 'Rain-or-shine playgrounds',
      heroHeading: 'Indoor dog park in Seattle',
      heroDescription:
        'Rainy winters and active dog community make Seattle indoor dog parks popular year-round. Climate-controlled facilities, training classes, and craft beverage partnerships create vibrant dog-friendly spaces.',
      heroPill: 'Year-round access',
      heroFootnotes: ['Capitol Hill · Ballard · South Lake Union'],
      heroChips: [
        { label: 'Training programs', value: 'Classes available' },
        { label: 'Brewery partners', value: 'Craft beverage' },
      ],
      insightIntro:
        'Seattle\'s rainy winters make indoor parks essential year-round. Many facilities offer training classes, agility courses, and partnerships with local breweries and cafes.',
      insightCards: [
        {
          tag: 'Year-round demand',
          title: 'Rainy season essential',
          copy: 'Seattle\'s wet winters make indoor parks popular year-round. Many facilities offer extended hours and special programs during the rainy season.',
          accent: true,
        },
        {
          tag: 'Active community',
          title: 'Training + play',
          copy: 'Seattle\'s active dog community values structured activities. Many indoor parks offer training classes, agility courses, and enrichment programs alongside free play.',
        },
        {
          tag: 'Craft culture',
          title: 'Brewery partnerships',
          copy: 'Many Seattle indoor parks partner with local breweries and cafes, creating social hubs that work for both dogs and their humans.',
        },
      ],
      planningCards: [
        {
          icon: 'bi-cloud-rain',
          title: 'Rain plan essentials',
          items: ['Reserve in advance on rainy weekends', 'Pack quick-dry towels', 'Use onsite dryers before heading out'],
        },
        {
          icon: 'bi-book',
          title: 'Training opportunities',
          items: ['Check class schedules in advance', 'Book training sessions separately', 'Combine play with structured activities'],
        },
        {
          icon: 'bi-geo-alt',
          title: 'Neighborhood focus',
          items: ['Capitol Hill: Urban, walkable options', 'Ballard: Brewery partnerships', 'South Lake Union: Tech-friendly amenities'],
        },
      ],
      mapSidebarNote:
        'Plot Capitol Hill, Ballard, and South Lake Union markers for quick access to year-round climate control and training programs.',
      faqs: seattleFaqs,
      faqSupportCard: {
        kicker: 'Rain-play operators',
        title: 'Download the Seattle rain-play kit',
        description: 'We bundled layouts, drainage guides, and brewery partnership templates for owners launching indoor parks in Seattle.',
        primary: { label: 'Get the kit', href: '/owner-resources' },
        secondary: { label: 'Talk partnerships', href: '/contact' },
      },
      ownerCta: {
        kicker: 'Franchise & owners',
        title: 'Build a Seattle indoor dog park',
        description:
          'Leverage training programs, brewery partnerships, and year-round climate control to keep membership calendars full. We provide market data and launch roadmaps.',
        primary: { label: 'Download owner playbook', href: '/owner-resources' },
        secondary: { label: 'Schedule a consult', href: '/contact' },
      },
    },
  },
];

export function getPriorityCityBySlug(slug: string) {
  return priorityCityContent.find((city) => city.slug === slug);
}

export function getPriorityCitySlugs() {
  return priorityCityContent.map((city) => city.slug);
}

export function getPriorityCityByName(cityName: string, state?: string) {
  return priorityCityContent.find(
    (city) =>
      city.city.toLowerCase() === cityName.toLowerCase() && (!state || city.state.toLowerCase() === state.toLowerCase()),
  );
}
