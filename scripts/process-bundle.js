const fs = require('fs');
const yaml = require('js-yaml');
const sortKeysDeep = require('./sort-keys.js');
const { A2A_DIR, A2A_SCHEMA_JSON, A2A_SCHEMA_YAML, YAML_NO_WRAP } = require('./paths.js');

const BUNDLE_SUFFIX = '.jsonschema.strict.bundle.json';
const DEFINITION_SUFFIX = '.jsonschema.strict.json';
const STRIPPED_PACKAGE_PREFIXES = ['lf.a2a.v1.', 'google.protobuf.'];

/** Strips the proto package prefixes and the plugin's file suffix from a definition name or $ref. */
const stripGeneratedNaming = (name) =>
  [...STRIPPED_PACKAGE_PREFIXES, DEFINITION_SUFFIX].reduce(
    (stripped, part) => stripped.replaceAll(part, ''),
    name
  );

const files = fs
  .readdirSync(A2A_DIR)
  .filter(f => f.endsWith(BUNDLE_SUFFIX))
  .sort();
if (files.length === 0) throw new Error('No bundle files found');

const schema = {
  '$schema': 'http://json-schema.org/draft-07/schema#',
  definitions: {}
};

files.forEach(bundleFile => {
  const bundle = JSON.parse(fs.readFileSync(`${A2A_DIR}/${bundleFile}`, 'utf8'));
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
  normalized[stripGeneratedNaming(key)] = value;
}
schema.definitions = normalized;

const normalizeRefs = (obj) => {
  if (typeof obj !== 'object' || obj === null) return;
  for (const key in obj) {
    if (key === '$ref' && typeof obj[key] === 'string') {
      obj[key] = stripGeneratedNaming(obj[key].replace('#/$defs/', '#/definitions/'));
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

const sortedSchema = sortKeysDeep(schema);
fs.writeFileSync(A2A_SCHEMA_JSON, JSON.stringify(sortedSchema, null, 2));
fs.writeFileSync(A2A_SCHEMA_YAML, yaml.dump(sortedSchema, YAML_NO_WRAP));

files.forEach(f => fs.unlinkSync(`${A2A_DIR}/${f}`));

console.log(`✓ Processed ${files.length} bundle files into unified schema`);