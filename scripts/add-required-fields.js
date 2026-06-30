const fs = require('fs');
const yaml = require('js-yaml');
const sortKeysDeep = require('./sort-keys.js');

const requiredFieldsMap = require('./parse-proto-required.js');

const schema = yaml.load(fs.readFileSync('a2a/a2a-schema.yaml', 'utf8'));

for (const [typeName, fields] of Object.entries(requiredFieldsMap)) {
  if (schema.definitions && schema.definitions[typeName]) {
    schema.definitions[typeName].required = fields;
    console.log(`✓ Added required fields to ${typeName}: [${fields.join(', ')}]`);
  } else {
    console.warn(`⚠ Warning: Type ${typeName} not found in schema`);
  }
}

const sortedSchema = sortKeysDeep(schema);
fs.writeFileSync('a2a/a2a-schema.yaml', yaml.dump(sortedSchema, {lineWidth: -1}));
fs.writeFileSync('a2a/a2a-schema.json', JSON.stringify(sortedSchema, null, 2));

console.log('\n✓ Schema updated with required fields');
