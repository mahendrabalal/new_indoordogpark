
import { readdir, readFile } from 'fs/promises';
import path from 'path';

async function run() {
    const citiesDir = path.join(process.cwd(), 'public/images/cities');
    const dirs = await readdir(citiesDir, { withFileTypes: true });

    const priorityContentPath = path.join(process.cwd(), 'src/data/priorityCityContent.ts');
    const content = await readFile(priorityContentPath, 'utf-8');

    const existingSlugs = new Set();
    const slugMatches = content.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
    for (const match of slugMatches) {
        existingSlugs.add(match[1]);
    }

    let newEntries = '';

    for (const dir of dirs) {
        if (dir.isDirectory() && dir.name.endsWith('-tx')) {
            const slug = dir.name;
            if (existingSlugs.has(slug)) continue;

            const cityNameBase = slug.replace(/-tx$/, '');
            const cityName = cityNameBase.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

            newEntries += `  {
    slug: '${slug}',
    city: '${cityName}',
    state: 'TX',
    featuredImage: '/images/cities/${slug}/hero.webp',
    summary: 'Explore top-rated dog parks and off-leash areas in ${cityName}, TX.',
    parks: [],
    customContent: {
      heroHeading: 'Dog Parks in ${cityName}, TX',
      heroDescription: 'Discover the best dog-friendly spots in ${cityName} with our verified directory of parks and facilities.',
    },
  },\n`;
        }
    }

    console.log(newEntries);
}

run();
