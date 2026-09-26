const fs = require('fs');

const protoContent = fs.readFileSync('a2a/a2a.proto', 'utf8');

const requiredFields = {};
let currentMessage = null;
let statement = '';

const lines = protoContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const messageMatch = line.match(/^message\s+(\w+)\s*\{/);
  if (messageMatch) {
    currentMessage = messageMatch[1];
    requiredFields[currentMessage] = [];
    statement = '';
    continue;
  }

  if (line.match(/^\}/)) {
    currentMessage = null;
    statement = '';
    continue;
  }

  if (!currentMessage) {
    continue;
  }

  statement += ' ' + line.replace(/\/\/.*$/, '').trim();
  if (!statement.includes(';')) {
    continue;
  }

  if (statement.includes('(google.api.field_behavior) = REQUIRED')) {
    const fieldMatch = statement.match(/(?:optional\s+|repeated\s+)?(?:map<[^>]+>|(?:\w+\.)*\w+)\s+(\w+)\s*=\s*\d+/);
    const jsonNameMatch = statement.match(/json_name\s*=\s*"([^"]+)"/);
    if (jsonNameMatch) {
      requiredFields[currentMessage].push(jsonNameMatch[1]);
    } else if (fieldMatch) {
      const fieldName = fieldMatch[1];
      const camelCase = fieldName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      requiredFields[currentMessage].push(camelCase);
    }
  }

  statement = '';
}

const filtered = {};
for (const [msg, fields] of Object.entries(requiredFields)) {
  if (fields.length > 0) {
    filtered[msg] = fields;
  }
}

module.exports = filtered;

if (require.main === module) {
  const assert = require('assert');
  assert.deepStrictEqual(filtered.SendMessageRequest, ['message']);
  assert.deepStrictEqual(filtered.GetTaskRequest, ['name']);
  assert.ok(!Object.values(filtered).some((fields) => fields.includes('tenant')));
  assert.ok(!('CancelTaskRequest' in filtered));
  console.log('✓ parse-proto-required self-check passed');
}
