import { PriorityStateConfig } from '@/types/state-content';

export const priorityStateContent: PriorityStateConfig[] = [
    {
        slug: 'california',
        name: 'California',
        abbr: 'CA',
        featuredImage: '/images/states/california/hero.webp',
        customContent: {
            heroEyebrow: 'Golden State Playgrounds',
            heroHeading: 'Dog Parks in California',
            heroDescription:
                'California stands as the undisputed leader in dog-friendly infrastructure across the United States, with over 68% of households owning at least one pet according to the American Pet Products Association. From the foggy off-leash beaches of San Francisco\'s Fort Funston to the sprawling 43-acre Fiesta Island Dog Park in San Diego—one of the largest dedicated off-leash areas in the nation—the Golden State offers unmatched variety. The state\'s Mediterranean climate means year-round outdoor play is possible in most regions, though the Central Valley and desert areas have driven significant growth in climate-controlled indoor facilities, particularly during summer months when pavement temperatures can exceed 140°F.\n\nWhat sets California apart is its integration of dog parks into urban planning. Cities like Los Angeles require new residential developments over 50 units to include pet amenities, while San Francisco maintains over 25 official off-leash areas managed by dedicated volunteer groups. The state also leads in the premium "dog social club" concept—membership-based facilities in cities like San Jose and Irvine that combine indoor play, grooming, and daycare services. Whether you\'re seeking a rugged coastal trail in Half Moon Bay or an air-conditioned play space in Palm Springs, our verified directory covers over 240 locations with real-time updates on amenities, hours, and community reviews.',
            heroPill: 'Verified CA Directory',
            heroFootnotes: ['Daily updates for LA & SF', 'Coastal & Inland coverage included'],
            heroChips: [
                { label: 'Verified Spots', value: '240+' },
                { label: 'Avg Rating', value: '4.6 / 5' },
            ],
            insightIntro:
                'Navigating the California dog park scene requires knowing your terrain. Whether it is a temperature-controlled indoor facility in the Central Valley heat or a rugged off-leash canyon in SoCal, our directory filters for quality and safety first.',
            insightCards: [
                {
                    tag: 'Coastal Access',
                    title: 'Beach & Trail Variety',
                    copy: 'California excels at outdoor variety. We recommend [San Diego](https://www.indoordogpark.org/cities/san-diego) for coastal runs and [Los Angeles](https://www.indoordogpark.org/cities/los-angeles) for hidden hillside parks.',
                    accent: true,
                },
                {
                    tag: 'Indoor Growth',
                    title: 'Urban Indoor Shift',
                    copy: 'Major cities like SF and SJ are seeing a surge in premium indoor dog clubs that combine play with coworking—essential for the active NorCal tech community.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-thermometer-sun',
                    title: 'California Heat Safety',
                    items: [
                        'Test pavement with the 7-second hand rule',
                        'Prioritize early morning or sunset play in summer',
                        'Keep a 1-gallon water supply in your vehicle',
                    ],
                },
                {
                    icon: 'bi-shield-check',
                    title: 'State Regulations',
                    items: [
                        'DOGS must be licensed and vaccinated per county laws',
                        'Always carry a 6ft leash, even in off-leash zones',
                        'Respect "Leashed Only" signs in State Parks',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'What are the best dog-friendly cities in California?',
                    answer:
                        'San Francisco consistently ranks top for indoor options, while San Diego leads for beach access. Check our directories for [Los Angeles](https://www.indoordogpark.org/cities/los-angeles) and [San Jose](https://www.indoordogpark.org/cities/san-jose) for high-density neighborhood options.',
                    category: 'cities',
                    popular: true,
                },
                {
                    question: 'Does California have many indoor dog parks?',
                    answer:
                        'Yes, the number of indoor facilities is growing rapidly in urban centers like the Bay Area and Orange County to provide relief from heat and smoke during fire season. These often require a [behavioral evaluation](https://www.akc.org/expert-advice/training/dog-park-etiquette/) before entry.',
                    category: 'facilities',
                },
            ],
        },
    },
    {
        slug: 'washington',
        name: 'Washington',
        abbr: 'WA',
        featuredImage: '/images/states/washington/hero.webp',
        customContent: {
            heroEyebrow: 'Evergreen State Enrichment',
            heroHeading: 'Dog Parks in Washington',
            heroDescription:
                'Washington State has earned its reputation as one of the most dog-friendly destinations in America, with Seattle consistently ranking among the top 5 cities for dog owners by WalletHub and Rover\'s annual surveys. The state\'s 200+ days of overcast weather hasn\'t deterred dog lovers—it\'s actually spurred innovation. The Puget Sound region pioneered the "indoor dog park" concept in the Pacific Northwest, with warehouse conversions in SODO and Ballard now serving thousands of members who refuse to let rain interrupt playtime. Marymoor Park in Redmond features a legendary 40-acre off-leash area that draws visitors from across the region every weekend.\n\nBeyond the Seattle metro, Washington offers remarkable diversity in dog-friendly spaces. The agricultural Yakima Valley and Spokane areas provide wide-open spaces with less crowding, while Olympic Peninsula trails welcome leashed hiking companions through temperate rainforests. The state\'s progressive pet culture is reflected in regulations—King County alone maintains 14 official off-leash areas with dedicated maintenance budgets. Our directory tracks over 130 verified locations statewide, from the premium indoor facilities of Bellevue to the rustic trails of Eastern Washington, all with current hours, amenity details, and community ratings from local dog owners.',
            heroPill: 'Verified WA Directory',
            heroFootnotes: ['Heavy focus on King County', 'Indoor rain-plans included'],
            heroChips: [
                { label: 'Total Parks', value: '130+' },
                { label: 'Rain-Proof Hubs', value: '15+' },
            ],
            insightIntro:
                'In Washington, dog-friendly means "all-weather". Seattle leads the way with warehouse conversions that keep pups dry and socialized during the long gray months.',
            insightCards: [
                {
                    tag: 'Rain Strategy',
                    title: 'Indoor Warehouse Hubs',
                    copy: 'Seattle and Bellevue host several "Rain-Proof" indoor dog parks. These are 100% climate-controlled, ensuring play never stops. See our [Seattle Guide](https://www.indoordogpark.org/cities/seattle).',
                    accent: true,
                },
                {
                    tag: 'Nature Trails',
                    title: 'Off-Leash Exploration',
                    copy: 'Beyond the city, Washington offers massive off-leash acreage in Marymoor and several King County parks that feel more like hiking trails than dog runs.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-cloud-rain',
                    title: 'Wet Weather Prep',
                    items: [
                        'Invest in a waterproof dog jacket for trail days',
                        'Keep towels and "paw-balm" in your car',
                        'Check for trail closures during heavy runoff',
                    ],
                },
                {
                    icon: 'bi-info-circle',
                    title: 'Community Etiquette',
                    items: [
                        'Washington dog owners prioritize "Leave No Trace"',
                        'Voice control is strict in multi-use parks',
                        'Always yield to horses or cyclists on shared trails',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'Are there many indoor dog parks in Seattle?',
                    answer:
                        'Yes! Seattle is a pioneer in the indoor dog park movement. Facilities like Dogwood Play Park combine dog play with human social bars, making them perfect for rainy evenings. Browse our [Seattle indoor listings](https://www.indoordogpark.org/cities/seattle) for details.',
                    category: 'facilities',
                    popular: true,
                },
                {
                    question: 'What is the best time to visit WA dog parks?',
                    answer:
                        'Weekday mornings are great for low-energy social time. Weekends at Marymoor (Redmond) are the gold standard for high-energy play, but expect crowds.',
                    category: 'planning',
                },
            ],
        },
    },
    {
        slug: 'texas',
        name: 'Texas',
        abbr: 'TX',
        featuredImage: '/images/states/texas/hero.webp',
        customContent: {
            heroEyebrow: 'Lone Star Dog Country',
            heroHeading: 'Dog Parks in Texas',
            heroDescription:
                'Everything is bigger in Texas, and that includes the state\'s commitment to dog-friendly spaces. With over 44% of Texas households owning dogs—the highest raw number of dog-owning households in the nation according to the AVMA—the demand for quality parks has driven remarkable infrastructure growth. Austin alone boasts 12 official off-leash areas, including the beloved Auditorium Shores and the 104-acre Emma Long Metropolitan Park. Houston\'s extensive bayou trail system offers over 80 miles of dog-friendly paths, while Dallas-Fort Worth maintains one of the largest municipal dog park networks in the American South, with dedicated facilities in nearly every major suburb.\n\nTexas summers present unique challenges, with temperatures regularly exceeding 100°F from June through September. This has fueled explosive growth in indoor dog facilities across major metros—climate-controlled warehouses in Houston\'s Heights district, membership-based play clubs in Austin\'s tech corridors, and splash pad facilities in San Antonio that let dogs cool off safely. The state\'s culture of community means most neighborhoods have active dog owner groups that maintain unofficial standards and organize events. Our directory covers over 280 verified Texas locations, with special attention to heat advisory information, shaded areas, and water access—critical details for summer visits.',
            heroPill: 'Verified TX Directory',
            heroFootnotes: ['Major metro coverage complete', 'Heat safety ratings included'],
            heroChips: [
                { label: 'Verified Spots', value: '280+' },
                { label: 'Indoor Options', value: '35+' },
            ],
            insightIntro:
                'Texas combines wide-open spaces with urban innovation. From sprawling ranch-style parks in the Hill Country to air-conditioned play facilities in Houston, the state offers something for every dog and owner.',
            insightCards: [
                {
                    tag: 'Beat the Heat',
                    title: 'Indoor & Splash Parks',
                    copy: 'Texas summers demand creative solutions. Check our [Austin](https://www.indoordogpark.org/cities/austin-tx) and [Houston](https://www.indoordogpark.org/cities/houston-tx) guides for AC-equipped and water-friendly options.',
                    accent: true,
                },
                {
                    tag: 'Urban Networks',
                    title: 'Metro Trail Systems',
                    copy: 'Dallas and Houston have invested heavily in connected trail networks. The Katy Trail in Dallas and Buffalo Bayou in Houston offer miles of dog-friendly paths.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-thermometer-high',
                    title: 'Texas Heat Protocol',
                    items: [
                        'Avoid outdoor parks between 10 AM - 6 PM in summer',
                        'Always check pavement temperature before walks',
                        'Carry at least 1 gallon of water per dog per hour',
                    ],
                },
                {
                    icon: 'bi-shield-check',
                    title: 'Texas Park Rules',
                    items: [
                        'Rabies vaccination required statewide',
                        'Many parks require city registration tags',
                        'Voice control mandatory in off-leash areas',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'Which Texas cities are best for dog owners?',
                    answer:
                        'Austin consistently ranks as Texas\'s most dog-friendly city with extensive off-leash options and dog-welcome businesses. Dallas and Houston offer the most variety in indoor facilities.',
                    category: 'cities',
                    popular: true,
                },
                {
                    question: 'Are Texas dog parks safe in summer?',
                    answer:
                        'With proper precautions, yes. Focus on early morning or evening visits, prioritize shaded and water-equipped parks, and consider indoor alternatives during peak heat.',
                    category: 'planning',
                },
            ],
        },
    },
    {
        slug: 'new-york',
        name: 'New York',
        abbr: 'NY',
        featuredImage: '/images/states/new-york/hero.webp',
        customContent: {
            heroEyebrow: 'Empire State Dog Scene',
            heroHeading: 'Dog Parks in New York',
            heroDescription:
                'New York State is home to one of the most vibrant and diverse dog cultures in America, anchored by New York City\'s legendary park system. Despite the urban density, NYC maintains over 100 designated off-leash areas across its five boroughs, with Central Park\'s off-leash hours (before 9 AM and after 9 PM) drawing thousands of dogs daily. The city\'s real estate constraints have driven innovation—rooftop dog parks in Manhattan, underground facilities in Brooklyn, and the famous "dog runs" that transform small urban spaces into social hubs. Beyond the city, Long Island, the Hudson Valley, and Upstate New York offer sprawling parks where dogs can run free.\n\nNew York\'s dog culture reflects its diverse population. You\'ll find luxurious grooming-and-play facilities on the Upper East Side, community-run volunteer-maintained runs in Brooklyn, and massive state park trail systems in the Catskills and Adirondacks. The state\'s four-season climate means parks adapt throughout the year—heated indoor facilities boom in winter, while summer sees dog-friendly beaches on Long Island draw weekend crowds. Our directory tracks over 180 verified locations across New York State, from Manhattan\'s compact urban runs to the 50+ acre off-leash areas in Westchester County and beyond.',
            heroPill: 'Verified NY Directory',
            heroFootnotes: ['NYC all five boroughs covered', 'Upstate trails included'],
            heroChips: [
                { label: 'Verified Spots', value: '180+' },
                { label: 'NYC Runs', value: '100+' },
            ],
            insightIntro:
                'New York\'s dog scene is as dynamic as the state itself. Whether you\'re navigating Manhattan\'s busy runs or exploring Catskills trails, our directory helps you find the perfect fit.',
            insightCards: [
                {
                    tag: 'Urban Innovation',
                    title: 'NYC Dog Runs',
                    copy: 'New York City\'s "dog run" culture has created unique social spaces. Explore our [New York City](https://www.indoordogpark.org/cities/new-york) guide for neighborhood-specific recommendations.',
                    accent: true,
                },
                {
                    tag: 'Nature Escapes',
                    title: 'Upstate Adventures',
                    copy: 'Beyond the city, the Hudson Valley and Finger Lakes regions offer dog-friendly wineries, hiking trails, and lakefront parks for weekend getaways.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-calendar-event',
                    title: 'Timing Your Visit',
                    items: [
                        'Central Park off-leash: before 9 AM and after 9 PM',
                        'Weekday mornings offer the quietest experience',
                        'Summer weekends at beach parks get very crowded',
                    ],
                },
                {
                    icon: 'bi-card-checklist',
                    title: 'NYC Requirements',
                    items: [
                        'Dogs must be licensed in NYC (current rabies required)',
                        'Leash required except in designated off-leash areas',
                        'Many runs have size-separated sections',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'What are the rules for off-leash dogs in Central Park?',
                    answer:
                        'Central Park allows off-leash dogs in designated areas during specific hours: before 9 AM and after 9 PM. Dogs must remain under voice control and owners must clean up after them.',
                    category: 'planning',
                    popular: true,
                },
                {
                    question: 'Are there indoor dog parks in NYC?',
                    answer:
                        'Yes! Manhattan and Brooklyn have several indoor facilities that offer climate-controlled play year-round. These are especially popular during winter months.',
                    category: 'facilities',
                },
            ],
        },
    },
    {
        slug: 'virginia',
        name: 'Virginia',
        abbr: 'VA',
        featuredImage: '/images/states/virginia/hero.webp',
        customContent: {
            heroEyebrow: 'Old Dominion Dog Destinations',
            heroHeading: 'Dog Parks in Virginia',
            heroDescription:
                'Virginia offers a compelling blend of historic charm and modern dog-friendly infrastructure that reflects the state\'s dual identity as both a Southern heritage destination and a dynamic Northern Virginia tech corridor. The state ranks among the top 15 for dog ownership nationally, with Northern Virginia suburbs like Arlington and Alexandria consistently appearing in "most dog-friendly cities" rankings. Arlington County alone maintains 14 dedicated dog parks, more per capita than most major cities, while Richmond\'s revitalized neighborhoods have embraced dog culture with boutique facilities and brewery patios welcoming four-legged patrons.\n\nVirginia\'s geographic diversity creates exceptional variety for dog owners. The Shenandoah Valley and Blue Ridge Mountains offer hundreds of miles of dog-friendly trails through some of the East Coast\'s most beautiful terrain. Coastal areas like Virginia Beach feature designated dog beaches operating seasonally. The Hampton Roads region has invested in modern off-leash facilities as young military families stationed at Norfolk Naval Base demand quality pet amenities. Our directory covers over 150 verified Virginia locations, from the polished urban parks of NoVA to the rugged mountain trails of the western highlands, all with current amenity information and community reviews.',
            heroPill: 'Verified VA Directory',
            heroFootnotes: ['NoVA comprehensive coverage', 'Trail and beach access mapped'],
            heroChips: [
                { label: 'Verified Spots', value: '150+' },
                { label: 'Avg Rating', value: '4.4 / 5' },
            ],
            insightIntro:
                'Virginia bridges urban sophistication and outdoor adventure. From Alexandria\'s meticulously maintained runs to Shenandoah\'s wild trails, the state rewards exploration.',
            insightCards: [
                {
                    tag: 'Urban Excellence',
                    title: 'Northern Virginia Parks',
                    copy: 'Arlington and Alexandria set the standard for urban dog parks in the Mid-Atlantic. Well-maintained, often with separated areas for small dogs.',
                    accent: true,
                },
                {
                    tag: 'Mountain Trails',
                    title: 'Blue Ridge Adventures',
                    copy: 'Virginia\'s mountain parks welcome leashed dogs on most trails. The Shenandoah National Park offers permit camping for overnight adventures with your pup.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-geo-alt',
                    title: 'Regional Highlights',
                    items: [
                        'NoVA: Most parks per capita in the state',
                        'Richmond: Growing brewery-and-dog-park scene',
                        'Coastal: Seasonal dog beaches in VA Beach',
                    ],
                },
                {
                    icon: 'bi-clipboard-check',
                    title: 'Virginia Requirements',
                    items: [
                        'Rabies vaccination mandatory statewide',
                        'Most counties require annual dog licenses',
                        'Leash required on all state park trails',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'Which Virginia suburbs are most dog-friendly?',
                    answer:
                        'Arlington and Alexandria in Northern Virginia consistently rank among the most dog-friendly areas, with excellent park access, dog-friendly restaurants, and strong community culture.',
                    category: 'cities',
                    popular: true,
                },
                {
                    question: 'Can I take my dog to Shenandoah National Park?',
                    answer:
                        'Yes! Dogs are welcome on most trails and campgrounds in Shenandoah. They must be leashed (6 feet or shorter) at all times and are not permitted on certain trails due to wildlife considerations.',
                    category: 'planning',
                },
            ],
        },
    },
    {
        slug: 'ohio',
        name: 'Ohio',
        abbr: 'OH',
        featuredImage: '/images/states/ohio/hero.webp',
        customContent: {
            heroEyebrow: 'Buckeye State Dog Parks',
            heroHeading: 'Dog Parks in Ohio',
            heroDescription:
                'Ohio has quietly emerged as a Midwestern leader in dog park development, driven by affordable land costs that allow for spacious facilities uncommon in coastal states. The Columbus metro area boasts one of the most impressive park systems in the region, with facilities like the 33-acre Scioto Audubon Metro Park dog area offering wetlands, prairie, and woodland terrain in a single visit. Cleveland\'s Metroparks system maintains dedicated off-leash areas with Lake Erie views, while Cincinnati\'s iconic Mount Airy Forest houses one of the oldest continuously operating dog parks in the Midwest, established in 1996.\n\nOhio\'s four-season climate has shaped its dog park culture in practical ways. Indoor facilities have grown significantly in Columbus and Cleveland to serve dog owners during harsh winters, while summer brings packed weekend crowds to lakefront and river-adjacent parks. The state\'s strong community culture means most neighborhoods have active dog owner networks that organize regular cleanup days and social events. Ohio also leads the region in "dog-friendly brewery" culture, with taprooms across all major cities welcoming pups on patios. Our directory tracks over 120 verified Ohio locations with special attention to seasonal hours, surface conditions, and amenities that matter during the state\'s variable weather.',
            heroPill: 'Verified OH Directory',
            heroFootnotes: ['Major metros fully covered', 'Seasonal hours tracked'],
            heroChips: [
                { label: 'Verified Spots', value: '120+' },
                { label: 'Avg Rating', value: '4.3 / 5' },
            ],
            insightIntro:
                'Ohio combines Midwestern friendliness with impressive park infrastructure. From Columbus\'s sprawling metro parks to Cleveland\'s lakefront gems, the Buckeye State delivers.',
            insightCards: [
                {
                    tag: 'Metro Park Systems',
                    title: 'Columbus & Cleveland',
                    copy: 'Both cities maintain exceptional metro park systems with dedicated dog areas. Columbus\'s Scioto Audubon and Cleveland\'s Lakefront are must-visits. See our [Columbus](https://www.indoordogpark.org/cities/columbus-oh) guide.',
                    accent: true,
                },
                {
                    tag: 'Brewery Culture',
                    title: 'Dog-Friendly Taprooms',
                    copy: 'Ohio\'s craft beer scene embraces dogs. Most breweries across Columbus, Cleveland, and Cincinnati welcome leashed dogs on patios.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-snow',
                    title: 'Winter Considerations',
                    items: [
                        'Check indoor facility hours during cold months',
                        'Many outdoor parks close sections for turf recovery',
                        'Salt and ice melt can irritate paw pads—wash after walks',
                    ],
                },
                {
                    icon: 'bi-info-circle',
                    title: 'Ohio Park Basics',
                    items: [
                        'County dog licenses required in most areas',
                        'Metro parks often require vehicle entry permits',
                        'Voice control expected in all off-leash areas',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'What is the best dog park in Columbus?',
                    answer:
                        'Scioto Audubon Metro Park\'s dog park is widely considered the best in Columbus, offering 33 acres of varied terrain including wetlands and prairie areas.',
                    category: 'cities',
                    popular: true,
                },
                {
                    question: 'Are Ohio dog parks open year-round?',
                    answer:
                        'Most outdoor dog parks remain open year-round, though hours may be reduced in winter. Some parks close sections seasonally for turf maintenance.',
                    category: 'planning',
                },
            ],
        },
    },
    {
        slug: 'pennsylvania',
        name: 'Pennsylvania',
        abbr: 'PA',
        featuredImage: '/images/states/pennsylvania/hero.webp',
        customContent: {
            heroEyebrow: 'Keystone State Canine Country',
            heroHeading: 'Dog Parks in Pennsylvania',
            heroDescription:
                'Pennsylvania anchors the Mid-Atlantic dog scene with two major urban centers that have developed distinct approaches to canine recreation. Philadelphia\'s dense neighborhoods feature over 40 dedicated dog parks, from the historic Schuylkill River Dog Park with city skyline views to tight-knit community runs in neighborhoods like Fishtown and South Philly. Pittsburgh\'s three-rivers geography creates unique waterfront park opportunities, with the 6-acre Frick Park Dog Park drawing visitors from across the region for its woodland trails and year-round accessibility. Both cities have seen significant growth in premium indoor facilities as young professionals prioritize pet amenities.\n\nBeyond the metros, Pennsylvania offers surprising variety. The Pocono Mountains welcome dog-friendly hikers with hundreds of miles of trails through state forests. Bucks County and the Main Line suburbs maintain some of the Mid-Atlantic\'s most polished community dog parks, reflecting the region\'s affluent commitment to pet amenities. The state\'s hunting tradition means rural Pennsylvania is remarkably dog-tolerant, with many state game lands permitting leashed dogs year-round. Our directory covers over 130 verified Pennsylvania locations, from Center City Philadelphia\'s urban runs to the mountain parks of the Laurel Highlands, all with current hours, surface conditions, and community ratings.',
            heroPill: 'Verified PA Directory',
            heroFootnotes: ['Philly and Pittsburgh complete', 'Pocono trails mapped'],
            heroChips: [
                { label: 'Verified Spots', value: '130+' },
                { label: 'Avg Rating', value: '4.3 / 5' },
            ],
            insightIntro:
                'Pennsylvania\'s two major cities offer distinct dog park cultures, while the countryside provides endless trail opportunities. From Philly\'s urban runs to Pittsburgh\'s woodland parks, exploration rewards.',
            insightCards: [
                {
                    tag: 'Urban Variety',
                    title: 'Philadelphia Dog Runs',
                    copy: 'Philly maintains over 40 dedicated dog parks across diverse neighborhoods. The Schuylkill River Dog Park offers stunning city views.',
                    accent: true,
                },
                {
                    tag: 'Woodland Escapes',
                    title: 'Pittsburgh\'s Frick Park',
                    copy: 'Pittsburgh\'s Frick Park Dog Park is a regional destination, offering woodland trails and streams in a 6-acre dedicated space.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-building',
                    title: 'City-Specific Tips',
                    items: [
                        'Philadelphia: Many parks require Philly Dog Parks registration',
                        'Pittsburgh: Frick Park is busiest on weekend mornings',
                        'Check neighborhood Facebook groups for run conditions',
                    ],
                },
                {
                    icon: 'bi-tree',
                    title: 'Trail Access',
                    items: [
                        'State forests generally permit leashed dogs',
                        'Some state parks have dog-prohibited zones near swimming areas',
                        'Hunting season (fall) requires blaze orange on trails',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'Which Philadelphia neighborhoods have the best dog parks?',
                    answer:
                        'Center City, Fairmount, and South Philadelphia all have excellent options. The Schuylkill River Trail area features one of the city\'s largest and most scenic dog parks.',
                    category: 'cities',
                    popular: true,
                },
                {
                    question: 'Can I take my dog hiking in the Poconos?',
                    answer:
                        'Yes! Most Pocono state parks and forests welcome leashed dogs on trails. Some swimming and beach areas may have seasonal restrictions.',
                    category: 'planning',
                },
            ],
        },
    },
    {
        slug: 'north-carolina',
        name: 'North Carolina',
        abbr: 'NC',
        featuredImage: '/images/states/north-carolina/hero.webp',
        customContent: {
            heroEyebrow: 'Tar Heel Dog Destinations',
            heroHeading: 'Dog Parks in North Carolina',
            heroDescription:
                'North Carolina has experienced remarkable growth in dog-friendly infrastructure as the state\'s major cities have attracted young professionals and families who prioritize pet amenities. The Research Triangle region—Raleigh, Durham, and Chapel Hill—now rivals Austin and Denver for dog-friendliness, with Raleigh maintaining 12 dedicated dog parks and Durham\'s downtown brewery scene enthusiastically welcoming canine companions. Charlotte has invested heavily in greenway development, creating over 50 miles of paved trails connecting parks throughout the metro, many with dedicated off-leash areas positioned along the route.\n\nNorth Carolina\'s geographic diversity creates exceptional variety for dog owners. The Blue Ridge Mountains and Great Smoky Mountains offer hundreds of miles of dog-friendly hiking trails, while the Outer Banks provides some of the East Coast\'s best dog beach access during off-seasons. The state\'s mild climate—rarely experiencing extreme heat or cold—means year-round outdoor activity is feasible with reasonable precautions. Asheville has emerged as a mountain town phenomenon for dog lovers, with dog-friendly breweries, restaurants, and shops creating an entire culture around canine companionship. Our directory tracks over 160 verified North Carolina locations with detailed information on terrain, amenities, and seasonal considerations.',
            heroPill: 'Verified NC Directory',
            heroFootnotes: ['Triangle and Charlotte coverage complete', 'Mountain trails mapped'],
            heroChips: [
                { label: 'Verified Spots', value: '160+' },
                { label: 'Avg Rating', value: '4.4 / 5' },
            ],
            insightIntro:
                'North Carolina combines Southern hospitality with progressive pet culture. From Raleigh\'s polished parks to Asheville\'s mountain dog scene, the state welcomes canine companions warmly.',
            insightCards: [
                {
                    tag: 'Urban Growth',
                    title: 'Triangle & Charlotte',
                    copy: 'Raleigh and Charlotte have invested heavily in dog infrastructure. Charlotte\'s greenway system connects parks across the metro for multi-mile adventures.',
                    accent: true,
                },
                {
                    tag: 'Mountain Culture',
                    title: 'Asheville Dog Scene',
                    copy: 'Asheville may be the Southeast\'s most dog-friendly city. Nearly every brewery, shop, and restaurant welcomes well-behaved dogs.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-sun',
                    title: 'Climate Advantages',
                    items: [
                        'Mild year-round temperatures allow consistent outdoor activity',
                        'Summer humidity requires extra water and shade awareness',
                        'Fall and spring offer ideal hiking conditions',
                    ],
                },
                {
                    icon: 'bi-water',
                    title: 'Coastal Access',
                    items: [
                        'Outer Banks beaches allow dogs year-round (leashed)',
                        'Many beaches have seasonal off-leash hours',
                        'Check individual town ordinances before visiting',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'What makes Asheville so dog-friendly?',
                    answer:
                        'Asheville\'s craft brewery and outdoor culture has embraced dogs completely. Most businesses welcome them, and the surrounding Blue Ridge trails offer excellent hiking.',
                    category: 'cities',
                    popular: true,
                },
                {
                    question: 'Are the Outer Banks good for dogs?',
                    answer:
                        'Yes! Many Outer Banks beaches permit dogs year-round, especially in shoulder seasons. Check individual town rules as regulations vary by community.',
                    category: 'planning',
                },
            ],
        },
    },
    {
        slug: 'tennessee',
        name: 'Tennessee',
        abbr: 'TN',
        featuredImage: '/images/states/tennessee/hero.webp',
        customContent: {
            heroEyebrow: 'Volunteer State Dog Parks',
            heroHeading: 'Dog Parks in Tennessee',
            heroDescription:
                'Tennessee has embraced dog culture with Southern hospitality, creating a welcoming environment for canine companions across its three distinct regions. Nashville\'s explosive population growth has driven significant investment in pet infrastructure, with the metro now maintaining over 15 dedicated dog parks and a thriving industry of dog-friendly patios and breweries along the East Nashville and Germantown corridors. The city\'s famous "Dog Day" festivals draw thousands, reflecting a community that considers pets full-fledged family members. Memphis maintains its own character, with Shelby Farms Park housing one of the South\'s largest off-leash areas at over 200 acres.\n\nKnoxville and the East Tennessee region provide gateway access to the Great Smoky Mountains, one of America\'s most visited national parks—and one that welcomes leashed dogs on two specific trails. The state\'s affordable cost of living and strong job growth have attracted young dog-owning families from across the country, spurring development of premium indoor facilities and dog-friendly apartment communities. Tennessee\'s moderate climate allows year-round outdoor activity, though summer humidity in the lowlands can be challenging during midday hours. Our directory covers over 140 verified Tennessee locations, from Nashville\'s urban parks to Memphis\'s legendary Shelby Farms and the mountain-adjacent facilities around Knoxville.',
            heroPill: 'Verified TN Directory',
            heroFootnotes: ['Nashville metro complete', 'Smoky Mountain area covered'],
            heroChips: [
                { label: 'Verified Spots', value: '140+' },
                { label: 'Avg Rating', value: '4.3 / 5' },
            ],
            insightIntro:
                'Tennessee combines Southern charm with serious dog park infrastructure. From Nashville\'s buzzing urban scene to Memphis\'s sprawling Shelby Farms, the Volunteer State delivers.',
            insightCards: [
                {
                    tag: 'Music City Dogs',
                    title: 'Nashville\'s Growth',
                    copy: 'Nashville\'s dog scene has exploded alongside the city\'s overall growth. East Nashville and Germantown lead with dog-friendly breweries and restaurants.',
                    accent: true,
                },
                {
                    tag: 'Mega Park',
                    title: 'Shelby Farms Memphis',
                    copy: 'Memphis\'s Shelby Farms Park includes over 200 acres of off-leash area—one of the largest urban dog parks in the United States.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-cloud-sun',
                    title: 'Weather Considerations',
                    items: [
                        'Summer humidity can be intense—prioritize mornings',
                        'Mild winters allow year-round outdoor activity',
                        'Spring storms can bring sudden closures',
                    ],
                },
                {
                    icon: 'bi-info-circle',
                    title: 'Tennessee Basics',
                    items: [
                        'Rabies vaccination required statewide',
                        'County registration varies—check local requirements',
                        'Voice control expected in all off-leash areas',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'Can I take my dog to the Great Smoky Mountains?',
                    answer:
                        'Dogs are permitted on only two trails in Great Smoky Mountains National Park: the Gatlinburg Trail and Oconaluftee River Trail. Leashes required at all times. Most visitors explore adjacent national forest land which has more permissive policies.',
                    category: 'planning',
                    popular: true,
                },
                {
                    question: 'What is Shelby Farms Park like for dogs?',
                    answer:
                        'Shelby Farms in Memphis offers over 200 acres of off-leash space with varied terrain including fields, woods, and lake access. It\'s one of the largest urban dog parks in America.',
                    category: 'facilities',
                },
            ],
        },
    },
    {
        slug: 'florida',
        name: 'Florida',
        abbr: 'FL',
        featuredImage: '/images/cities/jacksonville/hero.webp',
        customContent: {
            heroEyebrow: 'Sunshine State Dog Parks',
            heroHeading: 'Dog Parks in Florida',
            heroDescription:
                'Florida presents unique considerations for dog owners that set it apart from any other state in the nation. With year-round warm temperatures that frequently exceed thresholds safe for outdoor dog activity, the state has developed America\'s most extensive network of early-morning and evening dog culture. Miami-Dade County alone maintains over 30 dedicated dog parks, many featuring shade structures and water features designed specifically for the subtropical climate. The state\'s sprawling retirement and vacation communities have also invested heavily in pet amenities, recognizing that snowbirds and permanent residents alike prioritize their pets\' quality of life.\n\nFlorida\'s 1,350 miles of coastline create exceptional beach access for dogs, though regulations vary dramatically by municipality. Some beaches like Jupiter\'s Dog Beach and Fort De Soto Park\'s Dog Beach permit off-leash play, while most require leashes or prohibit dogs entirely during peak tourist seasons. The state\'s flat terrain means most parks focus on surface quality and shade rather than trails—look for turf-covered facilities with misters and covered rest areas. Indoor climate-controlled dog facilities have boomed in Orlando, Tampa, and South Florida as owners seek refuge from summer heat and afternoon thunderstorms. Our directory tracks over 200 verified Florida locations with essential information on shade coverage, water access, and seasonal restrictions.',
            heroPill: 'Verified FL Directory',
            heroFootnotes: ['South Florida comprehensive', 'Beach access mapped'],
            heroChips: [
                { label: 'Verified Spots', value: '200+' },
                { label: 'Dog Beaches', value: '25+' },
            ],
            insightIntro:
                'Florida dog ownership requires heat awareness and timing knowledge. Our directory focuses on shade, water access, and the early/late hours when outdoor activity is safest.',
            insightCards: [
                {
                    tag: 'Beat the Heat',
                    title: 'Climate Essentials',
                    copy: 'Florida summers demand strict timing discipline. Most experienced Florida dog owners visit parks before 8 AM or after 6 PM only during summer months.',
                    accent: true,
                },
                {
                    tag: 'Beach Access',
                    title: 'Coastal Dogs',
                    copy: 'Florida offers exceptional dog beach access at designated locations. Fort De Soto, Jupiter, and several North Florida beaches provide off-leash zones.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-thermometer-sun',
                    title: 'Heat Protocol (Essential)',
                    items: [
                        'Check pavement with palm of hand—if too hot for you, too hot for paws',
                        'Always visit before 8 AM or after 6 PM in summer',
                        'Seek parks with shade structures and water features',
                    ],
                },
                {
                    icon: 'bi-water',
                    title: 'Beach Rules',
                    items: [
                        'Dog beach access varies by municipality—always verify',
                        'Seasonal restrictions common during peak tourism',
                        'Rinse saltwater and sand from paws after visits',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'When is it safe to take dogs to Florida parks?',
                    answer:
                        'During summer months (May-September), limit outdoor activity to before 8 AM and after 6 PM. Even then, check pavement temperature and prioritize shaded facilities.',
                    category: 'planning',
                    popular: true,
                },
                {
                    question: 'What are the best dog beaches in Florida?',
                    answer:
                        'Fort De Soto Dog Beach (St. Petersburg area), Jupiter Dog Beach, and Davis Islands Dog Beach (Tampa) are among the most popular designated dog beaches in Florida.',
                    category: 'facilities',
                },
            ],
        },
    },
    {
        slug: 'georgia',
        name: 'Georgia',
        abbr: 'GA',
        featuredImage: '/images/states/georgia/hero.webp',
        customContent: {
            heroEyebrow: 'Peach State Dog Parks',
            heroHeading: 'Dog Parks in Georgia',
            heroDescription:
                'Georgia has transformed into a Southeastern dog park leader, driven primarily by Atlanta\'s explosive growth and the young professionals who\'ve made the city home. The metro Atlanta area now maintains over 50 dedicated dog parks, with standouts like the 42-acre Freedom Park Dog Park in the Inman Park/Little Five Points area and the newly renovated Piedmont Park Dog Park drawing hundreds of visitors daily. The city\'s BeltLine project—a 22-mile loop of trails and parks circling the urban core—has become a dog-walking destination unto itself, with multiple official off-leash areas positioned along the route.\n\nBeyond Atlanta, Georgia offers surprising variety for dog owners. Savannah\'s historic squares and riverfront parks welcome leashed dogs, maintaining the city\'s famously dog-friendly reputation. The North Georgia mountains provide hiking opportunities through Chattahoochee National Forest, where leashed dogs can explore hundreds of miles of trails. Athens, home to the University of Georgia, has developed its own vibrant dog culture centered on the Oconee River Greenway and numerous dog-friendly brewery patios. Georgia\'s humid summers require the same heat awareness as other Southern states, but the state\'s abundance of shaded, tree-covered parks provides relief uncommon in more arid regions. Our directory covers over 110 verified Georgia locations.',
            heroPill: 'Verified GA Directory',
            heroFootnotes: ['Atlanta metro complete', 'North GA trails included'],
            heroChips: [
                { label: 'Verified Spots', value: '110+' },
                { label: 'Avg Rating', value: '4.3 / 5' },
            ],
            insightIntro:
                'Georgia\'s dog scene centers on Atlanta\'s impressive park system but extends to mountain trails and coastal charm. The state combines Southern hospitality with serious pet infrastructure.',
            insightCards: [
                {
                    tag: 'Urban Hub',
                    title: 'Atlanta BeltLine',
                    copy: 'Atlanta\'s BeltLine has become a dog-walking institution. The 22-mile trail system includes multiple off-leash areas and connects dozens of neighborhoods.',
                    accent: true,
                },
                {
                    tag: 'Mountain Access',
                    title: 'North Georgia Trails',
                    copy: 'Chattahoochee National Forest offers hundreds of miles of dog-friendly trails. Popular areas include Amicalola Falls and Tallulah Gorge.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-sun',
                    title: 'Summer Strategy',
                    items: [
                        'Georgia humidity requires early morning or evening visits',
                        'Many parks have tree cover providing natural shade',
                        'Always carry water—fountains may not be working',
                    ],
                },
                {
                    icon: 'bi-signpost-2',
                    title: 'Georgia Basics',
                    items: [
                        'Rabies vaccination required statewide',
                        'Fulton and DeKalb counties require dog licenses',
                        'Voice control expected in off-leash areas',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'What are the best dog parks in Atlanta?',
                    answer:
                        'Piedmont Park Dog Park, Freedom Park Dog Park, and the various BeltLine off-leash areas are among Atlanta\'s most popular. Piedmont offers the most urban convenience.',
                    category: 'cities',
                    popular: true,
                },
                {
                    question: 'Is Savannah dog-friendly?',
                    answer:
                        'Very much so! Savannah\'s historic district welcomes leashed dogs in most squares and parks. Several restaurants offer dog-friendly outdoor seating along River Street.',
                    category: 'cities',
                },
            ],
        },
    },
    {
        slug: 'arizona',
        name: 'Arizona',
        abbr: 'AZ',
        featuredImage: '/images/cities/Phoenix/hero.webp',
        customContent: {
            heroEyebrow: 'Grand Canyon State Dog Parks',
            heroHeading: 'Dog Parks in Arizona',
            heroDescription:
                'Arizona presents one of America\'s most extreme environments for dog ownership, yet the state has responded with innovative solutions that make it a legitimate destination for pet lovers. Phoenix metro, home to over 5 million residents, maintains over 40 dedicated dog parks with a focus on features rarely seen elsewhere: splash pads, shaded ramadas, and dawn-to-dusk lighting that enables year-round early morning and late evening visits. The Valley of the Sun has also seen explosive growth in indoor dog facilities—climate-controlled warehouses and membership clubs where summer temperatures in the 110-120°F range are irrelevant.\n\nHigher elevations offer relief that surprises visitors. Flagstaff, Sedona, and Prescott all maintain dog-friendly cultures with considerably milder climates, making them popular summer escapes for Phoenix-area dog owners. Northern Arizona\'s national forests permit leashed dogs on most trails, providing access to pine forests and mountain streams. Tucson offers its own distinct character, with desert-themed dog parks integrated into the Sonoran landscape and a strong rescue dog community. The state\'s desert environment does require serious heat awareness—ground temperatures can exceed 160°F during summer afternoons, causing severe paw burns within seconds. Our directory tracks over 100 verified Arizona locations with essential information on shade structures, splash pads, and seasonal recommendations.',
            heroPill: 'Verified AZ Directory',
            heroFootnotes: ['Phoenix valley complete', 'High-country alternatives included'],
            heroChips: [
                { label: 'Verified Spots', value: '100+' },
                { label: 'Indoor Facilities', value: '15+' },
            ],
            insightIntro:
                'Arizona dog ownership demands heat intelligence. Our directory emphasizes facilities with shade structures, splash pads, and the high-elevation alternatives that provide summer relief.',
            insightCards: [
                {
                    tag: 'Desert Solutions',
                    title: 'Phoenix Innovations',
                    copy: 'Phoenix-area parks lead the nation in shade structures and splash pad features. See our [Phoenix](https://www.indoordogpark.org/cities/phoenix) guide for heat-smart options.',
                    accent: true,
                },
                {
                    tag: 'Elevation Escapes',
                    title: 'Flagstaff & Sedona',
                    copy: 'Northern Arizona\'s higher elevations offer 20-30°F cooler temperatures. Flagstaff and Prescott are popular summer escapes for Valley dog owners.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-thermometer-sun',
                    title: 'Desert Heat Protocol (Critical)',
                    items: [
                        'Ground temps can reach 160°F—NEVER walk on asphalt in summer afternoons',
                        'Stick to grass/turf surfaces or indoor facilities May-September',
                        'Sunrise visits (before 7 AM) are the only safe summer window',
                    ],
                },
                {
                    icon: 'bi-geo',
                    title: 'Elevation Options',
                    items: [
                        'Flagstaff (7,000 ft) stays 20-30°F cooler than Phoenix',
                        'Prescott and Sedona offer intermediate relief',
                        'Coconino National Forest welcomes leashed dogs',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'When is it safe to visit Phoenix dog parks?',
                    answer:
                        'May through September, limit outdoor visits to before 7 AM or well after sunset. Even then, test ground temperature with your palm. Many owners switch entirely to indoor facilities during summer.',
                    category: 'planning',
                    popular: true,
                },
                {
                    question: 'Are there dog-friendly trails near Phoenix?',
                    answer:
                        'Yes, but timing is critical. The McDowell Mountain and South Mountain preserves offer dog-friendly trails, but summer visits must occur at dawn. Higher elevation options in Flagstaff provide safer summer alternatives.',
                    category: 'facilities',
                },
            ],
        },
    },
    {
        slug: 'colorado',
        name: 'Colorado',
        abbr: 'CO',
        featuredImage: '/images/cities/minneapolis-mn/hero.png',
        customContent: {
            heroEyebrow: 'Centennial State Adventures',
            heroHeading: 'Dog Parks in Colorado',
            heroDescription:
                'Colorado consistently ranks among America\'s most dog-friendly states, driven by an outdoor culture that considers canine companions essential partners in adventure. Denver alone maintains over 12 dedicated off-leash dog parks, with the crown jewel being the 107-acre Cherry Creek State Park Off-Leash Area—one of the largest urban dog spaces in the nation featuring a swimming reservoir, fields, and shaded rest areas. The city\'s progressive pet policies extend beyond parks, with dog-friendly breweries, restaurants, and shops creating an entire ecosystem of canine-welcoming businesses throughout RiNo, LoDo, and the Highlands neighborhoods.\n\nBeyond the Front Range cities, Colorado\'s mountain communities have embraced dog culture wholeheartedly. Boulder\'s extensive open space system includes multiple off-leash voice-and-sight areas where well-trained dogs explore alongside hikers. Ski towns like Breckenridge, Vail, and Aspen maintain summer dog parks and welcome pets at many trailheads. The state\'s national forests—covering over 14 million acres—generally permit leashed dogs on trails, providing access to alpine meadows, mountain lakes, and legendary scenery. Colorado\'s high altitude and intense sun require awareness, but the mild summer temperatures (compared to lowland states) allow comfortable outdoor activity during months when Southern states are too hot for dogs. Our directory tracks over 130 verified Colorado locations from the plains to 14,000-foot peaks.',
            heroPill: 'Verified CO Directory',
            heroFootnotes: ['Denver metro complete', 'Mountain towns included'],
            heroChips: [
                { label: 'Verified Spots', value: '130+' },
                { label: 'Avg Rating', value: '4.5 / 5' },
            ],
            insightIntro:
                'Colorado\'s dog culture is legendary. From Denver\'s impressive urban parks to mountain trails welcoming your hiking partner, the state sets the standard for dog-friendly living.',
            insightCards: [
                {
                    tag: 'Urban Flagship',
                    title: 'Cherry Creek Dog Park',
                    copy: 'Denver\'s Cherry Creek State Park Off-Leash Area spans 107 acres with reservoir swimming, making it one of America\'s premier urban dog destinations.',
                    accent: true,
                },
                {
                    tag: 'Mountain Culture',
                    title: 'Boulder & Beyond',
                    copy: 'Boulder\'s open space system pioneered voice-and-sight control areas. Well-trained dogs can explore off-leash on designated trails.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-sun',
                    title: 'Altitude Awareness',
                    items: [
                        'High elevation sun is intense—even cool days can cause overheating',
                        'Bring extra water—dogs dehydrate faster at altitude',
                        'Watch for signs of altitude sickness in dogs above 8,000 ft',
                    ],
                },
                {
                    icon: 'bi-signpost-split',
                    title: 'Trail Guidelines',
                    items: [
                        'National Forest trails generally permit leashed dogs',
                        'Wilderness areas have varying regulations—check specific rules',
                        'Voice-and-sight areas require demonstrated control',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'What is the best dog park in Denver?',
                    answer:
                        'Cherry Creek State Park Off-Leash Area is widely considered the best, offering 107 acres including reservoir swimming. Within the city proper, Berkeley Park and Stapleton also excel.',
                    category: 'cities',
                    popular: true,
                },
                {
                    question: 'Can I take my dog hiking in Colorado?',
                    answer:
                        'Yes! Most national forest trails welcome leashed dogs. Some wilderness areas have restrictions. Boulder\'s open space system offers off-leash voice-and-sight areas for well-trained dogs.',
                    category: 'planning',
                },
            ],
        },
    },
    {
        slug: 'illinois',
        name: 'Illinois',
        abbr: 'IL',
        featuredImage: '/images/cities/chicago-il/hero.png',
        customContent: {
            heroEyebrow: 'Prairie State Dog Parks',
            heroHeading: 'Dog Parks in Illinois',
            heroDescription:
                'Illinois dog culture centers on Chicago, which maintains one of the most impressive urban dog park systems in the Midwest. The city operates over 25 dedicated "Dog Friendly Areas" (DFAs) spread across its diverse neighborhoods, from the lakefront jewels of Montrose Dog Beach—one of few urban beaches permitting off-leash swim access—to neighborhood favorites in Lincoln Park, Wicker Park, and Hyde Park. Chicago\'s density has driven innovation in small-space design, with many DFAs maximizing limited footprints through smart layout and separated areas for small dogs. The city\'s robust public transit system means dog owners can actually access parks without cars in many neighborhoods.\n\nBeyond Chicago, the suburban collar counties maintain their own networks of larger facilities. The DuPage County Forest Preserve maintains over 20 off-leash areas, including the massive 110-acre Blackwell Forest Preserve dog area with trails, swimming, and rolling prairie terrain. Lake County and Will County have followed suit with dedicated facilities in their forest preserves. Downstate, university towns like Champaign-Urbana and Bloomington-Normal maintain dog parks proportional to their student and young professional populations. Illinois\' four-season climate means winter-hardy facilities matter—look for parks with cold weather hours and access to indoor alternatives during brutal January stretches. Our directory covers over 100 verified Illinois locations.',
            heroPill: 'Verified IL Directory',
            heroFootnotes: ['Chicago DFAs complete', 'Collar county preserves included'],
            heroChips: [
                { label: 'Verified Spots', value: '100+' },
                { label: 'Dog Beach', value: 'Montrose' },
            ],
            insightIntro:
                'Illinois dog parks reflect Chicago\'s urban innovation and the collar counties\' expansive forest preserves. From lakefront beaches to prairie trails, variety abounds.',
            insightCards: [
                {
                    tag: 'Urban Icon',
                    title: 'Montrose Dog Beach',
                    copy: 'Chicago\'s Montrose Dog Beach offers rare urban lakefront swimming. One of the Midwest\'s premier dog destinations during summer months.',
                    accent: true,
                },
                {
                    tag: 'Suburban Escapes',
                    title: 'Forest Preserve System',
                    copy: 'DuPage and Lake County forest preserves maintain extensive off-leash areas with trails and swimming—far more space than city parks allow.',
                },
            ],
            planningCards: [
                {
                    icon: 'bi-snow2',
                    title: 'Winter Planning',
                    items: [
                        'Many DFAs reduce hours or close sections in winter',
                        'Watch for salt and ice melt irritating paws',
                        'Indoor alternatives become essential January-February',
                    ],
                },
                {
                    icon: 'bi-card-list',
                    title: 'Chicago DFA Rules',
                    items: [
                        'Dogs must be licensed, vaccinated, and registered',
                        'Leash required until inside DFA boundaries',
                        'Voice control and cleanup required at all times',
                    ],
                },
            ],
            faqs: [
                {
                    question: 'What are the best dog parks in Chicago?',
                    answer:
                        'Montrose Dog Beach for lakefront swimming, Wiggly Field in Lincoln Park for central access, and the Hamlin Park DFA for a well-maintained neighborhood option.',
                    category: 'cities',
                    popular: true,
                },
                {
                    question: 'Are Chicago dog parks open in winter?',
                    answer:
                        'Yes, most DFAs remain open year-round, though hours may be reduced. Watch for icy conditions and salt exposure on paws during harsh winter months.',
                    category: 'planning',
                },
            ],
        },
    },
];
