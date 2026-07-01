const fs = require('fs');
const path = require('path');

let yaml;
try {
  yaml = require('js-yaml');
} catch {
  yaml = require('yaml');
}

const files = process.argv.slice(2);
let errors = 0;

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const doc = yaml.parse ? yaml.parse(content) : yaml.load(content);

    const issues = [];
    if (!doc || typeof doc !== 'object') issues.push('not a valid YAML document');
    if (!doc.config) issues.push('missing top-level "config" section');
    if (!doc.scenarios) issues.push('missing top-level "scenarios" section');
    if (!doc.config?.target) issues.push('config.target is missing');
    if (!doc.config?.phases?.length) issues.push('config.phases is missing or empty');

    if (issues.length > 0) {
      console.error(`FAIL: ${file} - ${issues.join('; ')}`);
      errors++;
    } else {
      console.log(`OK: ${file}`);
    }
  } catch (e) {
    console.error(`FAIL: ${file} - ${e.message}`);
    errors++;
  }
}

process.exit(errors > 0 ? 1 : 0);
