const { readScript, parseScript } = require('artillery/util');

const files = process.argv.slice(2);
let errors = 0;

async function main() {
  for (const file of files) {
    try {
      const data = await readScript(file);
      const doc = await parseScript(data);

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
}

main();
