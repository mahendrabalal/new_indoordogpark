const fs = require('fs');

const filePath = 'public/data/missouri.json';
const rawData = fs.readFileSync(filePath);
const parks = JSON.parse(rawData);

// List of generic templates to replace
const genericPatterns = [
    "Amenities at",
    "This facility features onsite services",
    "is a must-visit location that combines convenience with fun",
    "serves as a premier destination for the local canine community"
];

// Helper to generate a unique description
function generateDescription(park) {
    const name = park.name || "This park";
    const city = park.city || "Missouri";
    const rating = park.rating || 0;
    const reviews = park.reviewCount || 0;
    const amenities = park.amenities || {};

    let features = [];
    if (amenities["Indoor facilities"]) features.push("indoor facilities for all-weather play");
    if (amenities["Climate controlled"]) features.push("climate-controlled areas");
    if (amenities["Professional staff"]) features.push("professional staff on-site");
    if (amenities["Onsite services"]) features.push("convenient onsite services");

    let intro = "";
    const intros = [
        `${name} is a favorite spot for dog owners in ${city}.`,
        `Located in ${city}, ${name} offers a welcoming space for pets to exercise and socialize.`,
        `If you're in ${city}, bring your furry friend to ${name} for a great day out.`,
        `${name} provides a safe and fun environment for dogs of all sizes in the heart of ${city}.`
    ];
    intro = intros[Math.floor(Math.random() * intros.length)];

    let body = "";
    if (features.length > 0) {
        body = `This park is well-equipped with amenities such as ${features.join(", ")}, ensuring a comfortable visit for both you and your pet.`;
    } else {
        body = "The park features ample space for running and playing, making it a perfect destination for active dogs.";
    }

    let social = "";
    if (reviews > 100 && rating >= 4.0) {
        social = `With a solid ${rating}-star rating from over ${reviews} reviews, it's a highly recommended community favorite.`;
    } else if (rating >= 4.0) {
        social = `Visitors appreciate the clean environment and friendly atmosphere, reflected in its ${rating}-star rating.`;
    } else {
        social = "Locals enjoy the convenient location and the opportunity for their dogs to burn off energy.";
    }

    let outro = "";
    const outros = [
        `For more details, you can visit the [official website](${park.website || '#'}) or check out local guides at [Indoor Dog Park](https://www.indoordogpark.org/).`,
        `Plan your visit today! For rules and hours, see the [park website](${park.website || '#'}) or verify details on [Indoor Dog Park](https://www.indoordogpark.org/).`,
        `Make sure to check the [official page](${park.website || '#'}) for membership info. For more dog-friendly spots, browse [Indoor Dog Park](https://www.indoordogpark.org/).`
    ];
    outro = outros[Math.floor(Math.random() * outros.length)];

    return `${intro}\n\n${body} ${social} ${outro}`;
}

let rewrittenCount = 0;

parks.forEach(park => {
    const desc = park.description || "";
    let isGeneric = false;

    // Check if current description matches any generic pattern
    for (const pattern of genericPatterns) {
        if (desc.includes(pattern)) {
            isGeneric = true;
            break;
        }
    }

    if (isGeneric) {
        park.description = generateDescription(park);
        rewrittenCount++;
    }
});

fs.writeFileSync(filePath, JSON.stringify(parks, null, 2));

console.log(`Successfully rewrote ${rewrittenCount} generic descriptions.`);
