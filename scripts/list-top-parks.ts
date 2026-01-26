import fs from 'fs';
import path from 'path';

const TARGET_FILE = path.join(process.cwd(), 'public/data/newjersey.json');

interface Park {
    id: string;
    name: string;
    description: string;
    reviewCount: number;
}

try {
    const rawData = fs.readFileSync(TARGET_FILE, 'utf-8');
    const parks: Park[] = JSON.parse(rawData);

    // Filter for parks that might have been just updated (or generally high review counts)
    // We want to manually polish the *most popular* ones to ensure quality key spots.
    const topParks = parks
        .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 15);

    console.log("Top 15 Parks by Review Count to Consider for Manual Polish:");
    topParks.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} (${p.reviewCount} reviews)`);
    });

} catch (error) {
    console.error("Error:", error);
}
