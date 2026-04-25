const fs = require('fs');
let content = fs.readFileSync('lib/jobs.ts', 'utf8');
content = content.replace(/category: ".*",/g, match => match + '\n    url: "",');
fs.writeFileSync('lib/jobs.ts', content);
