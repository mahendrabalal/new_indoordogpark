// Script to generate flawless redirects
const listicles = [
  ['top-5-best-indoor-dog-parks-in-fresno-beat-the-central-valley-heat', 'fresno'],
  ['top-10-best-indoor-dog-parks-in-denver-colorado', 'denver'],
  ['top-5-best-indoor-dog-parks-in-san-francisco', 'san-francisco'],
  ['top-10-best-indoor-dog-parks-in-san-jose-and-indoor-friendly-play-areas', 'san-jose'],
  ['top-5-best-indoor-dog-parks-in-oklahoma-city', 'oklahoma-city'],
  ['top-5-best-indoor-dog-parks-in-milwaukee-your-winter-play-guide', 'milwaukee'],
  ['top-10-bestindoor-dog-park-in-san-antonio-texas', 'san-antonio'],
  ['top-7-best-indoor-dog-parks-and-daycares-in-aurora-co', 'aurora'],
  ['top-10-indoor-dog-parks-and-dog-daycares-in-fort-worth-texas', 'fort-worth'],
  ['7-best-indoor-dog-parks-in-minneapolis', 'minneapolis'],
  ['top-10-best-indoor-dog-parks-in-houston', 'houston'],
  ['8-best-indoor-dog-parks-in-las-vegas', 'las-vegas'],
  ['best-indoor-dog-parks-in-chicago', 'chicago'],
  ['10-best-indoor-dog-parks-and-daycares-in-oakland-ca', 'oakland'],
  ['top-10-best-indoor-dog-parks-in-dallas-texas', 'dallas'],
  ['top-10-best-indoor-dog-parks-in-raleigh-nc-play-hard-rain-or-shine', 'raleigh'],
  ['the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-virginia-beach-va', 'virginia-beach'],
  ['top-5-best-indoor-dog-parks-in-memphis-your-ultimate-guide-for-year-round-play', 'memphis'],
  ['top-5-best-indoor-dog-parks-in-sacramento-beat-the-central-valley-heat', 'sacramento'],
  ['4-best-indoor-dog-parks-in-columbus-ohio', 'columbus'],
  ['top-5-best-indoor-dog-parks-in-brooklyn-complete-local-guide-pet-parents', 'brooklyn'],
  ['best-indoor-dog-parks-in-portland-oregon', 'portland'],
  ['top-5-best-indoor-dog-parks-in-seattle', 'seattle'],
  ['the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-omaha-ne', 'omaha'],
  ['best-indoor-dog-parks-new-york-city', 'new-york'],
  ['top-6-best-indoor-dog-parks-and-daycares-in-wichita-ks', 'wichita'],
  ['the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-brookhaven-ga', 'brookhaven'],
  ['top-5-best-indoor-dog-parks-in-boston', 'boston'],
  ['top-5-best-indoor-dog-parks-in-detroit', 'detroit'],
  ['top-8-best-indoor-dog-parks-in-kansas-city-your-all-weather-playbook', 'kansas-city'],
  ['best-indoor-dog-parks-in-phoenix-your-complete-guide', 'phoenix'],
  ['top-10-best-doggy-soft-play-areas-in-los-angeles', 'los-angeles'],
  ['top-10-best-indoor-dog-parks-in-charlotte-nc', 'charlotte'],
  ['top-5-best-indoor-dog-parks-in-indianapolis', 'indianapolis'],
  ['top-indoor-dog-parks-in-jacksonville-florida', 'jacksonville'],
  ['indoor-dog-parks-in-austin-tx-top-spots-for-your-pup', 'austin'],
  ['top-10-best-indoor-dog-parks-in-mesa-az', 'mesa'],
  ['top-5-best-indoor-dog-parks-in-washington-dc', 'washington-dc'],
  ['top-6-best-indoor-dog-parks-and-daycares-in-arlington-tx', 'arlington'],
  ['the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-colorado-springs-co', 'colorado-springs'],
  ['top-5-best-indoor-dog-parks-in-el-paso', 'el-paso'],
  ['10-best-indoor-dog-parks-dog-bars-and-daycares-in-tampa-fl', 'tampa'],
  ['10-best-indoor-dog-parks-and-daycares-in-bakersfield-ca', 'bakersfield'],
  ['top-7-best-climate-controlled-dog-play-areas-in-albuquerque-nm', 'albuquerque'],
  ['top-10-best-indoor-dog-parks-in-miami-fl-beat-the-heat-and-humidity', 'miami'],
  ['the-ultimate-guide-to-the-top-10-best-indoor-dog-parks-in-long-beach-ca', 'long-beach'],
  ['top-10-best-indoor-dog-parks-in-san-diego-california', 'san-diego'],
  ['top-5-best-indoor-dog-parks-in-henderson-nevada-a-complete-guide', 'henderson'],
  ['9-best-indoor-dog-parks-in-tulsa-where-to-play-rain-or-shine', 'tulsa'],
  ['top-8-best-indoor-dog-parks-in-tucson-a-local-s-guide-to-beating-the-heat', 'tucson'],
  ['best-indoor-dog-parks-in-long-island', 'long-island'],
  ['top-8-best-indoor-dog-parks-in-atlanta-surviving-the-georgia-heat-and-rain', 'atlanta']
];

const redirects = listicles.map(([slug, city]) => {
  return `      {
        source: '/blog/${slug}',
        destination: '/cities/${city}',
        permanent: true,
      },`;
});

const fs = require('fs');
fs.writeFileSync('/Users/mahendrabalal/Desktop/new_indoordogpark/scripts/generated-redirects-clean.js', redirects.join('\\n'));
console.log("Wrote clean redirects");
