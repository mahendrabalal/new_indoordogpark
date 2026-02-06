import fs from 'fs';
import path from 'path';

const target = path.resolve('.open-next', 'server-functions', 'default', '.next', 'server', 'instrumentation.js');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, 'module.exports = {};\n', 'utf8');
console.log(`wrote ${target}`);
