const fs = require('fs');
const yaml = require('js-yaml');

/**
 * Lists the rpc names of `service A2AService`, which A2A v1.0 uses verbatim as JSON-RPC method
 * names (spec section 5.3).
 */
function serviceMethods(protoContent) {
  const service = protoContent.match(/^service A2AService \{([\s\S]*?)^\}/m);
  if (!service) {
    throw new Error('service A2AService not found in a2a/a2a.proto');
  }
  return [...service[1].matchAll(/^\s*rpc\s+(\w+)\s*\(/gm)].map((match) => match[1]);
}

const rpcs = serviceMethods(fs.readFileSync('a2a/a2a.proto', 'utf8'));
const schema = yaml.load(fs.readFileSync('a2a/a2a-schema.yaml', 'utf8'));
const methods = schema.definitions.JSONRPCRequest.properties.method.enum;
const missing = rpcs.filter((rpc) => !methods.includes(rpc));
const extra = methods.filter((method) => !rpcs.includes(method));
if (missing.length > 0 || extra.length > 0) {
  throw new Error(
    `A2AMethod in a2a/a2a-jsonrpc.proto drifted from A2AService: missing [${missing}], extra [${extra}]`
  );
}
console.log(`✓ A2AMethod matches the ${rpcs.length} A2AService rpcs`);
