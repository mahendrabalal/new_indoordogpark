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
        phone: '(312) 555-1920',
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
        phone: '(773) 555-4401',
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
        phone: '(312) 555-2290',
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
        phone: '(612) 555-8899',
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
        phone: '(612) 555-2211',
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
        phone: '(612) 555-0909',
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
        phone: '(503) 555-1470',
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
        phone: '(503) 555-9981',
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
        phone: '(503) 555-6654',
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
        phone: '(503) 555-1122',
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
        phone: '(614) 555-7711',
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
        phone: '(614) 555-4100',
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
        phone: '(614) 555-8801',
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
        phone: '(614) 555-9897',
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
    slug: 'phoenix-az',
    city: 'Phoenix',
    state: 'AZ',
    featuredImage: 'https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?auto=format&fit=crop&w=1600&q=80',
    summary:
      'Peak search volume in summer—pair landing page with heat alerts and membership waitlist CTAs.',
    parks: [
      {
        id: 'phx-desert-dome',
        name: 'Desert Dog Dome',
        businessType: 'Indoor Dog Park',
        description:
          'Arcadia anchor with chilled turf, mist tunnels, and sensor-driven HVAC to beat 110°F afternoons.',
        slug: 'priority-phx-desert-dome',
        address: '3322 N 44th St',
        street: '3322 N 44th St',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85018',
        full_address: '3322 N 44th St, Phoenix, AZ 85018',
        latitude: 33.4852,
        longitude: -111.9856,
        phone: '(602) 555-4420',
        website: 'https://www.desertdogdome.com',
        rating: 4.8,
        reviewCount: 205,
        pricing: {
          isFree: false,
          pricingType: 'membership',
          dropInFee: 25,
          priceRange: '$$$',
        },
        indoorOutdoor: 'indoor',
        amenities: {
          seating: true,
          swimming: true,
          shade: true,
          daycare: true,
          training: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        source: 'static',
      },
      {
        id: 'phx-arcadia-climate',
        name: 'Arcadia Climate Club',
        businessType: 'Indoor Dog Park',
        description:
          'Lounge-forward members club with UV-filtered skylights, iced lattes, and Pilates-for-pups classes.',
        slug: 'priority-phx-arcadia',
        address: '4251 E Indian School Rd',
        street: '4251 E Indian School Rd',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85018',
        full_address: '4251 E Indian School Rd, Phoenix, AZ 85018',
        latitude: 33.495,
        longitude: -111.9899,
        phone: '(602) 555-7780',
        website: 'https://www.arcadiaclimateclub.com',
        rating: 4.7,
        reviewCount: 160,
        pricing: {
          isFree: false,
          pricingType: 'membership',
          dropInFee: 28,
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
            url: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
      {
        id: 'phx-valley-pack',
        name: 'Valley Pack Lounge',
        businessType: 'Indoor Dog Park',
        description:
          'Downtown Phoenix concept with cooled concrete, daybeds, and a waitlist that opens whenever temps top 100°F.',
        slug: 'priority-phx-valley-pack',
        address: '30 W Monroe St',
        street: '30 W Monroe St',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85003',
        full_address: '30 W Monroe St, Phoenix, AZ 85003',
        latitude: 33.4518,
        longitude: -112.074,
        phone: '(602) 555-3300',
        website: 'https://www.valleypacklounge.com',
        rating: 4.6,
        reviewCount: 147,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 24,
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
            url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
      {
        id: 'phx-chandler-chill',
        name: 'Chandler Chill Barn',
        businessType: 'Indoor Dog Park',
        description:
          'East Valley barn retrofit with massive fans, splash pads, and cold plunge tubs for heat relief days.',
        slug: 'priority-phx-chandler-chill',
        address: '2885 E Chandler Blvd',
        street: '2885 E Chandler Blvd',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85048',
        full_address: '2885 E Chandler Blvd, Phoenix, AZ 85048',
        latitude: 33.3044,
        longitude: -112.0229,
        phone: '(480) 555-9030',
        website: 'https://www.chandlerchillbarn.com',
        rating: 4.5,
        reviewCount: 132,
        pricing: {
          isFree: false,
          pricingType: 'daily',
          dropInFee: 22,
          priceRange: '$$',
        },
        amenities: {
          swimming: true,
          daycare: true,
          training: true,
          parking: true,
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1494253109108-2e30c049369b?auto=format&fit=crop&w=900&q=80',
            type: 'photo',
          },
        ],
        indoorOutdoor: 'indoor',
        source: 'static',
      },
    ],
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
        phone: '(702) 555-1020',
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
        phone: '(702) 555-7878',
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
        phone: '(702) 555-9090',
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
        phone: '(702) 555-6600',
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
