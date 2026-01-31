
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

async function run() {
    const priorityContentPath = path.join(process.cwd(), 'src/data/priorityCityContent.ts');
    let content = await readFile(priorityContentPath, 'utf-8');

    // Fix the messed up brackets
    // Replace multiple closing brackets + whitespace + comma + whitespace + more brackets
    // with a clean structure.

    // This is a bit risky but let's try a targeted replace.
    content = content.replace(/\},\s*\},\s*\},\s*\}/g, '    },\n  }');
    content = content.replace(/\},\s*\},\s*\}/g, '    },\n  }');
    content = content.replace(/\s*\},\s*\},\s*\];/g, '\n  },\n];');

    // And fix the customContent closing which got joined
    content = content.replace(/facilities\.',\s*\}\s*,\s*\}/g, "facilities.',\n    },\n  }");

    // Also fix the case where I had "}, },"
    content = content.replace(/\},\s*\}\s*,\s*\{/g, '},\n  {');

    await writeFile(priorityContentPath, content);
}

run();
