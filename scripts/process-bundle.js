const fs = require('fs');
const yaml = require('js-yaml');

const files = fs.readdirSync('a2a').filter(f => f.endsWith('.jsonschema.strict.bundle.json'));
if (files.length === 0) throw new Error('No bundle files found');

const schema = {
  '$schema': 'http://json-schema.org/draft-07/schema#',
  definitions: {}
};

files.forEach(bundleFile => {
  const bundle = JSON.parse(fs.readFileSync('a2a/' + bundleFile, 'utf8'));
  if (bundle.$defs) {
    Object.assign(schema.definitions, bundle.$defs);
  }
});

const cleanDescriptions = (obj) => {
  if (typeof obj !== 'object' || obj === null) return;
  for (const key in obj) {
    if (key === 'description' && typeof obj[key] === 'string') {
      let cleaned = obj[key]
        .replace(/--8<--\s*\[start:\w+\]\s*/g, '')
        .replace(/\s*--8<--\s*\[end:\w+\]/g, '')
        .trim();
      if (cleaned === '') {
        delete obj[key];
      } else {
        obj[key] = cleaned;
      }
    } else if (typeof obj[key] === 'object') {
      cleanDescriptions(obj[key]);
    }
  }
};
cleanDescriptions(schema);

const normalized = {};
for (const [key, value] of Object.entries(schema.definitions)) {
  const cleanName = key
    .replace(/^a2a\.v1\./, '')
    .replace(/\.jsonschema\.strict\.json$/, '')
    .replace(/^google\.protobuf\./, '');
  normalized[cleanName] = value;
}
schema.definitions = normalized;

const normalizeRefs = (obj) => {
  if (typeof obj !== 'object' || obj === null) return;
  for (const key in obj) {
    if (key === '$ref' && typeof obj[key] === 'string') {
      obj[key] = obj[key]
        .replace('#/$defs/', '#/definitions/')
        .replace(/a2a\.v1\./g, '')
        .replace(/\.jsonschema\.strict\.json/g, '')
        .replace(/google\.protobuf\./g, '');
    } else if (typeof obj[key] === 'object') {
      normalizeRefs(obj[key]);
    }
  }
};
normalizeRefs(schema);

const removePatternProps = (obj) => {
  if (typeof obj !== 'object' || obj === null) return;
  if (obj.patternProperties) {
    delete obj.patternProperties;
  }
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      removePatternProps(obj[key]);
    }
  }
};
removePatternProps(schema);

fs.writeFileSync('a2a/a2a-schema.json', JSON.stringify(schema, null, 2));
fs.writeFileSync('a2a/a2a-schema.yaml', yaml.dump(schema, {lineWidth: -1}));

files.forEach(f => fs.unlinkSync('a2a/' + f));

console.log(`✓ Processed ${files.length} bundle files into unified schema`);