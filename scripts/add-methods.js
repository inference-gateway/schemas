const fs = require('fs');
const yaml = require('js-yaml');
const sortKeysDeep = require('./sort-keys.js');

/**
 * Lists the rpc names of `service A2AService` in proto order. A2A v1.0 uses them verbatim as
 * JSON-RPC method names (spec section 9.3), but protoc-gen-jsonschema drops services, so they
 * never reach the generated bundle.
 */
function parseServiceMethods(protoContent) {
  const service = protoContent.match(/^service A2AService \{([\s\S]*?)^\}/m);
  if (!service) {
    throw new Error('service A2AService not found in a2a/a2a.proto');
  }
  return [...service[1].matchAll(/^\s*rpc\s+(\w+)\s*\(/gm)].map((match) => match[1]);
}

const methods = parseServiceMethods(fs.readFileSync('a2a/a2a.proto', 'utf8'));
if (!methods.includes('SendMessage') || !methods.includes('DeleteTaskPushNotificationConfig')) {
  throw new Error(`unexpected A2AService rpcs: [${methods.join(', ')}]`);
}

const schema = yaml.load(fs.readFileSync('a2a/a2a-schema.yaml', 'utf8'));
schema.definitions.A2AMethod = {
  description:
    'JSON-RPC method names of the A2A service. A2A v1.0 uses the A2AService rpc names verbatim (spec section 9.3).',
  enum: methods,
  title: 'A2A Method',
  type: 'string',
};
console.log(`✓ Added A2AMethod enum: [${methods.join(', ')}]`);

const sortedSchema = sortKeysDeep(schema);
fs.writeFileSync('a2a/a2a-schema.yaml', yaml.dump(sortedSchema, {lineWidth: -1}));
fs.writeFileSync('a2a/a2a-schema.json', JSON.stringify(sortedSchema, null, 2));
