const fs = require('fs');
const yaml = require('js-yaml');
const sortKeysDeep = require('./sort-keys.js');

const requiredFieldsMap = require('./parse-proto-required.js');

const schema = yaml.load(fs.readFileSync('a2a/a2a-schema.yaml', 'utf8'));

// The jsonschema plugin marks every implicit-presence scalar/enum field as required,
// so `required` is derived solely from the proto's field_behavior annotations here.
for (const [typeName, definition] of Object.entries(schema.definitions || {})) {
  const fields = requiredFieldsMap[typeName];
  if (fields) {
    definition.required = fields;
    console.log(`✓ Added required fields to ${typeName}: [${fields.join(', ')}]`);
  } else if (definition.required) {
    delete definition.required;
    console.log(`✓ Removed plugin-generated required fields from ${typeName}`);
  }
}

for (const typeName of Object.keys(requiredFieldsMap)) {
  if (!schema.definitions || !schema.definitions[typeName]) {
    console.warn(`⚠ Warning: Type ${typeName} not found in schema`);
  }
}

const sortedSchema = sortKeysDeep(schema);
fs.writeFileSync('a2a/a2a-schema.yaml', yaml.dump(sortedSchema, {lineWidth: -1}));
fs.writeFileSync('a2a/a2a-schema.json', JSON.stringify(sortedSchema, null, 2));

console.log('\n✓ Schema updated with required fields');
