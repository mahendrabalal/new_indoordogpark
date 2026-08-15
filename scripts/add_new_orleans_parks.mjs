import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

const mutation = {
  mutations: [
    {
      create: {
        _type: 'parkSubmission',
        name: 'Camp Bow Wow New Orleans',
        slug: { _type: 'slug', current: 'camp-bow-wow-new-orleans' },
        status: 'approved',
        listingType: 'free',
        businessType: 'Dog Daycare',
        description: 'Located in the vibrant Mid-City neighborhood, Camp Bow Wow features expansive, fully climate-controlled indoor play yards, live Camper Cams, and certified Camp Counselors.',
        address: '3301 Conti St',
        city: 'New Orleans',
        state: 'Louisiana',
        zipCode: '70119',
        phone: '(504) 831-2267',
        website: 'https://www.campbowwow.com/mid-city'
      }
    },
    {
      create: {
        _type: 'parkSubmission',
        name: 'Dogtopia of New Orleans',
        slug: { _type: 'slug', current: 'dogtopia-of-new-orleans' },
        status: 'approved',
        listingType: 'free',
        businessType: 'Dog Daycare',
        description: 'Situated in the beautiful Uptown area, Dogtopia brings a premium, spa-like experience to indoor dog daycare, featuring specialized rubberized flooring and advanced HVAC air filtration.',
        address: '9501 Airline Hwy',
        city: 'New Orleans',
        state: 'Louisiana',
        zipCode: '70118',
        phone: '(504) 285-3647',
        website: 'https://www.dogtopia.com/new-orleans/'
      }
    },
    {
      create: {
        _type: 'parkSubmission',
        name: 'Zeus\' Place',
        slug: { _type: 'slug', current: 'zeus-place' },
        status: 'approved',
        listingType: 'free',
        businessType: 'Pet Boarding',
        description: 'A highly localized, boutique business on the bustling Freret Street corridor offering an intimate, personalized approach to indoor play and on-site grooming.',
        address: '4601 Freret St',
        city: 'New Orleans',
        state: 'Louisiana',
        zipCode: '70115',
        phone: '(504) 309-2144',
        website: 'https://zeusplace.com'
      }
    },
    {
      create: {
        _type: 'parkSubmission',
        name: 'Pet Paradise New Orleans',
        slug: { _type: 'slug', current: 'pet-paradise-new-orleans' },
        status: 'approved',
        listingType: 'free',
        businessType: 'Pet Resort',
        description: 'A massive, resort-style facility located in Kenner near the airport, featuring a signature bone-shaped swimming pool and huge indoor synthetic turf pavilions.',
        address: '45 E Airline Hwy',
        city: 'Kenner',
        state: 'Louisiana',
        zipCode: '70062',
        phone: '(504) 467-1111',
        website: 'https://www.petparadise.com/new-orleans.htm'
      }
    },
    {
      create: {
        _type: 'parkSubmission',
        name: 'Canine Connection',
        slug: { _type: 'slug', current: 'canine-connection' },
        status: 'approved',
        listingType: 'free',
        businessType: 'Dog Daycare',
        description: 'An incredible Uptown gem focusing on a relaxed, highly supervised daycare experience with 24/7 staffing, small playgroups, and weather-proof indoor agility areas.',
        address: '4920 Tchoupitoulas St',
        city: 'New Orleans',
        state: 'Louisiana',
        zipCode: '70115',
        phone: '(504) 218-4098',
        website: 'https://canineconnectionnola.com'
      }
    }
  ]
};

async function main() {
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(mutation)
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
