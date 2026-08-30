const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog-content');
const CONTENT_BLOG_DIR = path.join(__dirname, '..', 'content', 'blog');

const RED_FLAG_PATTERNS = [
  { name: 'Explicit E-E-A-T reference', regex: /\bE-E-A-T\b/i },
  { name: 'Google Guidelines/Criteria mention', regex: /Google['’]?s?\s+(E-E-A-T|criteria|guidelines|standards)/i },
  { name: 'Veterinary-backed in prose', regex: /\bveterinary-backed\b/i },
  { name: 'Throat-clearing opening (is widely recognized)', regex: /is widely recognized as one of/i },
  { name: 'Throat-clearing opening (In today\'s fast-paced)', regex: /in today['’]?s fast[- ]paced/i },
  { name: 'Throat-clearing opening (Whether you are wading)', regex: /whether you are wading through/i },
  { name: 'Unverified reviewer claim', regex: /reviewedBy:\s*"Dr\./i },
];

function checkDirectory(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const issues = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      for (const pattern of RED_FLAG_PATTERNS) {
        if (pattern.regex.test(line)) {
          issues.push({
            file: path.relative(path.join(__dirname, '..'), fullPath),
            line: idx + 1,
            rule: pattern.name,
            snippet: line.trim().slice(0, 100)
          });
        }
      }

      // Check link density (more than 3 markdown links in a single line/paragraph)
      const linkMatches = line.match(/\[([^\]]+)\]\(([^)]+)\)/g);
      if (linkMatches && linkMatches.length > 3) {
        issues.push({
          file: path.relative(path.join(__dirname, '..'), fullPath),
          line: idx + 1,
          rule: `High link density (${linkMatches.length} links in line)`,
          snippet: line.trim().slice(0, 100)
        });
      }
    });
  }

  return issues;
}

console.log('--- Scanning Blog Content for Algorithmic Red Flags ---');
const blogIssues = checkDirectory(BLOG_DIR);
const contentIssues = checkDirectory(CONTENT_BLOG_DIR);
const allIssues = [...blogIssues, ...contentIssues];

if (allIssues.length === 0) {
  console.log('✅ No algorithmic red flags detected across blog content!');
} else {
  console.log(`⚠️ Found ${allIssues.length} issues to resolve:\n`);
  allIssues.forEach(iss => {
    console.log(`- [${iss.file}:${iss.line}] ${iss.rule}`);
    console.log(`  "${iss.snippet}..."\n`);
  });
}
