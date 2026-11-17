/**
 * Recursively sorts object keys so the generated A2A schema has a stable order.
 * Otherwise definitions merge in filesystem-dependent `fs.readdirSync` order and every
 * re-sync produces noisy diffs. Array order is kept since it is significant for
 * `required`, `enum` and proto field ordering.
 */
function sortKeysDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeysDeep(value[key]);
        return acc;
      }, {});
  }
  return value;
}

module.exports = sortKeysDeep;
