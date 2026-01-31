
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

async function run() {
    const priorityContentPath = path.join(process.cwd(), 'src/data/priorityCityContent.ts');
    const content = await readFile(priorityContentPath, 'utf-8');

    // Split elements and rebuild them cleanly
    // A clean element looks like:
    /*
    {
      slug: '...',
      ...
      customContent: {
        ...
      },
    },
    */

    // Regex to find each major object block
    // This is tricky for a 500k file, but let's try to split by "slug:"
    const parts = content.split(/\n\s*slug:/);
    const header = parts[0];
    const items = parts.slice(1);

    const fixedItems = items.map((item, index) => {
        // Each item starts with " 'slug-value', "
        // We need to find where the next one starts or where this one ends.
        // But we already split by slug.

        // Remove trailing junk (from previous messed up closing)
        let cleaned = item.trim();
        cleaned = cleaned.replace(/\s*\},?\s*\},?\s*\},?\s*,?$/, ''); // Remove messed up tail
        cleaned = cleaned.replace(/\s*\},?\s*\},?\s*,?$/, '');
        cleaned = cleaned.replace(/\s*\},?\s*,?$/, '');

        // Re-add proper closing
        return `\n    slug:${cleaned}\n    },\n  }`;
    });

    const newContent = header + fixedItems.join(',') + '\n];' + content.slice(content.lastIndexOf(' export function') === -1 ? content.length : content.lastIndexOf(' export function'));

    await writeFile(priorityContentPath, newContent);
}

run();
