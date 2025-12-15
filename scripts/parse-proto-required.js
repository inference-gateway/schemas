const fs = require('fs');

const protoContent = fs.readFileSync('a2a/a2a.proto', 'utf8');

const requiredFields = {};
let currentMessage = null;

const lines = protoContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const messageMatch = line.match(/^message\s+(\w+)\s*\{/);
  if (messageMatch) {
    currentMessage = messageMatch[1];
    requiredFields[currentMessage] = [];
    continue;
  }

  if (line.match(/^\}/)) {
    currentMessage = null;
    continue;
  }

  if (currentMessage && line.includes('[(google.api.field_behavior) = REQUIRED]')) {
    const fieldMatch = line.match(/^\s+(?:optional\s+|repeated\s+)?(?:map<[^>]+>|(?:\w+\.)*\w+)\s+(\w+)\s*=/);
    if (fieldMatch) {
      const fieldName = fieldMatch[1];
      const camelCase = fieldName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      requiredFields[currentMessage].push(camelCase);
    }
  }
}

const filtered = {};
for (const [msg, fields] of Object.entries(requiredFields)) {
  if (fields.length > 0) {
    filtered[msg] = fields;
  }
}

module.exports = filtered;