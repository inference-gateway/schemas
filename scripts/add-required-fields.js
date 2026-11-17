const fs = require('fs');
const yaml = require('js-yaml');
const sortKeysDeep = require('./sort-keys.js');
const { A2A_SCHEMA_JSON, A2A_SCHEMA_YAML, YAML_NO_WRAP } = require('./paths.js');

const requiredFieldsMap = require('./parse-proto-required.js');

/**
 * Derives each definition's `required` solely from the proto's field_behavior annotations,
 * because the jsonschema plugin marks every implicit-presence scalar/enum field as required.
 */
function replaceRequiredWithAnnotations(definitions) {
  for (const [typeName, definition] of Object.entries(definitions)) {
    const fields = requiredFieldsMap[typeName];
    if (fields) {
      definition.required = fields;
      console.log(`✓ Added required fields to ${typeName}: [${fields.join(', ')}]`);
    } else if (definition.required) {
      delete definition.required;
      console.log(`✓ Removed plugin-generated required fields from ${typeName}`);
    }
  }
}

const schema = yaml.load(fs.readFileSync(A2A_SCHEMA_YAML, 'utf8'));

replaceRequiredWithAnnotations(schema.definitions || {});

for (const typeName of Object.keys(requiredFieldsMap)) {
  if (!schema.definitions || !schema.definitions[typeName]) {
    console.warn(`⚠ Warning: Type ${typeName} not found in schema`);
  }
}

const sortedSchema = sortKeysDeep(schema);
fs.writeFileSync(A2A_SCHEMA_YAML, yaml.dump(sortedSchema, YAML_NO_WRAP));
fs.writeFileSync(A2A_SCHEMA_JSON, JSON.stringify(sortedSchema, null, 2));

console.log('\n✓ Schema updated with required fields');
