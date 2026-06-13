export const CITY_WEATHER_CONTEXT: Record<string, string> = {
  'seattle': 'Escape the famous Seattle rain',
  'portland': 'Dodge the Pacific Northwest drizzle',
  'phoenix': 'Beat the intense Arizona summer heat',
  'las-vegas': 'Escape the scorching desert sun',
  'miami': 'Avoid the unpredictable tropical storms and humidity',
  'chicago': 'Stay warm during the freezing Windy City winters',
  'minneapolis': 'Escape the brutal Midwest cold',
  'houston': 'Beat the intense Texas heat and humidity',
  'dallas': 'Escape the scorching Texas summer sun',
  'austin': 'Beat the Texas heat and keep your pup cool',
  'denver': 'Dodge unexpected snowstorms or intense altitude sun',
  'new-york': 'Escape the harsh winter cold or sweltering summer sidewalks',
  'boston': 'Avoid freezing winter days and slushy streets',
  'atlanta': 'Beat the muggy Southern heat',
  'los-angeles': 'Escape the midday heat and smog',
  'san-diego': 'Beat the occasional heatwave or "May Gray"',
  'san-francisco': 'Escape the unpredictable fog and chilly winds',
  'orlando': 'Dodge the daily summer thunderstorms and heat',
  'tampa': 'Avoid the sweltering heat and afternoon rain',
};

/**
 * Returns a hyper-local weather context string for a given city slug.
 * If the city is not in the top lookup table, it returns a generic fallback.
 */
export function getWeatherContext(citySlug: string): string {
  const normalizedSlug = citySlug.toLowerCase().trim();
  if (CITY_WEATHER_CONTEXT[normalizedSlug]) {
    return `${CITY_WEATHER_CONTEXT[normalizedSlug]}`;
  }
  return 'Escape unpredictable local weather and extreme temperatures';
}
