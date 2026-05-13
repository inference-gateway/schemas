#!/usr/bin/env node
// One-shot reachability checker for the OAS spec.
//
// Walks every $ref starting from operations under `paths.*` and reports
// whether the streaming-payload schemas are reachable. This mirrors what
// oapi-codegen's pruner does when --skip-prune is NOT passed: any schema
// that isn't reachable from an operation is dropped from the generated
// types. We use it to verify the fix for issue #31.
//
// Usage: node scripts/check-reachable.js [path/to/openapi.yaml]

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const filePath = process.argv[2] || path.join(__dirname, '..', 'openapi.yaml');
const spec = yaml.load(fs.readFileSync(filePath, 'utf8'));

const reachable = new Set();

function resolveRef(ref) {
  if (!ref.startsWith('#/')) return null;
  const parts = ref.slice(2).split('/');
  let cur = spec;
  for (const p of parts) {
    if (cur == null) return null;
    cur = cur[p];
  }
  return cur;
}

function walk(node) {
  if (node == null) return;
  if (Array.isArray(node)) {
    for (const item of node) walk(item);
    return;
  }
  if (typeof node !== 'object') return;
  if (typeof node.$ref === 'string') {
    const key = node.$ref;
    if (!reachable.has(key)) {
      reachable.add(key);
      const resolved = resolveRef(key);
      if (resolved) walk(resolved);
    }
  }
  for (const k of Object.keys(node)) {
    if (k === '$ref') continue;
    walk(node[k]);
  }
}

for (const pathItem of Object.values(spec.paths || {})) {
  walk(pathItem);
}

const targets = [
  '#/components/schemas/CreateChatCompletionStreamResponse',
  '#/components/schemas/ChatCompletionStreamChoice',
  '#/components/schemas/ChatCompletionStreamResponseDelta',
  '#/components/schemas/ChatCompletionMessageToolCallChunk',
];

let allOk = true;
for (const t of targets) {
  const ok = reachable.has(t);
  console.log(`${ok ? 'OK  ' : 'MISS'}  ${t}`);
  if (!ok) allOk = false;
}

console.log('---');
console.log(`Total reachable refs from operations: ${reachable.size}`);
process.exit(allOk ? 0 : 1);
