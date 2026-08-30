// Script to generate redirects for all cannibalizing listicles
const listicles = [
'top-5-best-indoor-dog-parks-in-fresno-beat-the-central-valley-heat',
'top-10-best-indoor-dog-parks-in-denver-colorado',
'top-5-best-indoor-dog-parks-in-san-francisco',
'top-10-best-indoor-dog-parks-in-san-jose-and-indoor-friendly-play-areas',
'top-5-best-indoor-dog-parks-in-oklahoma-city',
'top-5-best-indoor-dog-parks-in-milwaukee-your-winter-play-guide',
'top-10-bestindoor-dog-park-in-san-antonio-texas',
'top-7-best-indoor-dog-parks-and-daycares-in-aurora-co',
'top-10-indoor-dog-parks-and-dog-daycares-in-fort-worth-texas',
'7-best-indoor-dog-parks-in-minneapolis',
'top-10-best-indoor-dog-parks-in-houston',
'8-best-indoor-dog-parks-in-las-vegas',
'best-indoor-dog-parks-in-chicago',
'10-best-indoor-dog-parks-and-daycares-in-oakland-ca',
'top-10-best-indoor-dog-parks-in-dallas-texas',
'top-10-best-indoor-dog-parks-in-raleigh-nc-play-hard-rain-or-shine',
'the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-virginia-beach-va',
'top-5-best-indoor-dog-parks-in-memphis-your-ultimate-guide-for-year-round-play',
'top-5-best-indoor-dog-parks-in-sacramento-beat-the-central-valley-heat',
'4-best-indoor-dog-parks-in-columbus-ohio',
'top-5-best-indoor-dog-parks-in-brooklyn-complete-local-guide-pet-parents',
'best-indoor-dog-parks-in-portland-oregon',
'top-5-best-indoor-dog-parks-in-seattle',
'the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-omaha-ne',
'best-indoor-dog-parks-new-york-city',
'top-6-best-indoor-dog-parks-and-daycares-in-wichita-ks',
'the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-brookhaven-ga',
'top-5-best-indoor-dog-parks-in-boston',
'top-5-best-indoor-dog-parks-in-detroit',
'top-8-best-indoor-dog-parks-in-kansas-city-your-all-weather-playbook',
'best-indoor-dog-parks-in-phoenix-your-complete-guide',
'top-10-best-doggy-soft-play-areas-in-los-angeles',
'top-10-best-indoor-dog-parks-in-charlotte-nc',
'top-5-best-indoor-dog-parks-in-indianapolis',
'top-indoor-dog-parks-in-jacksonville-florida',
'indoor-dog-parks-in-austin-tx-top-spots-for-your-pup',
'top-10-best-indoor-dog-parks-in-mesa-az',
'top-5-best-indoor-dog-parks-in-washington-dc',
'top-6-best-indoor-dog-parks-and-daycares-in-arlington-tx',
'the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-colorado-springs-co',
'top-5-best-indoor-dog-parks-in-el-paso',
'10-best-indoor-dog-parks-dog-bars-and-daycares-in-tampa-fl',
'10-best-indoor-dog-parks-and-daycares-in-bakersfield-ca',
'top-7-best-climate-controlled-dog-play-areas-in-albuquerque-nm',
'top-10-best-indoor-dog-parks-in-miami-fl-beat-the-heat-and-humidity',
'the-ultimate-guide-to-the-top-10-best-indoor-dog-parks-in-long-beach-ca',
'top-10-best-indoor-dog-parks-in-san-diego-california',
'top-5-best-indoor-dog-parks-in-henderson-nevada-a-complete-guide',
'9-best-indoor-dog-parks-in-tulsa-where-to-play-rain-or-shine',
'top-8-best-indoor-dog-parks-in-tucson-a-local-s-guide-to-beating-the-heat',
'best-indoor-dog-parks-in-long-island',
'top-8-best-indoor-dog-parks-in-atlanta-surviving-the-georgia-heat-and-rain'
];

function extractCity(slug) {
  let city = slug;
  // Remove common prefixes/suffixes
  city = city.replace(/^(top-\d+-)?(best-)?(indoor-dog-parks-in-|indoor-dog-park-in-|indoor-dog-parks-and-daycares-in-|climate-controlled-dog-play-areas-in-|doggy-soft-play-areas-in-|the-ultimate-guide-to-the-top-\d+-best-indoor-dog-parks-in-|the-ultimate-guide-to-the-top-\d+-indoor-dog-parks-in-|best-indoor-dog-parks-in-|top-indoor-dog-parks-in-)/, '');
  city = city.replace(/-(beat-the-central-valley-heat|and-indoor-friendly-play-areas|your-winter-play-guide|play-hard-rain-or-shine|your-ultimate-guide-for-year-round-play|complete-local-guide-pet-parents|your-all-weather-playbook|your-complete-guide|top-spots-for-your-pup|beat-the-heat-and-humidity|a-complete-guide|where-to-play-rain-or-shine|a-local-s-guide-to-beating-the-heat|surviving-the-georgia-heat-and-rain)$/, '');
  city = city.replace(/-colorado|-texas|-co|-tx|-ca|-nc|-va|-ohio|-oregon|-ks|-ga|-az|-dc|-fl|-nm|-california|-nevada/, '');
  return city;
}

const redirects = listicles.map(slug => {
  const city = extractCity(slug);
  return `      {
        source: '/blog/${slug}',
        destination: '/cities/${city}',
        permanent: true,
      },`;
});

const fs = require('fs');
fs.writeFileSync('/Users/mahendrabalal/Desktop/new_indoordogpark/scripts/generated-redirects.js', redirects.join('\\n'));
console.log("Wrote to generated-redirects.js");
