/**
 * Recursively sort object keys so the generated A2A schema is emitted in a
 * stable, canonical order. Without this, definitions are merged in
 * `fs.readdirSync` order (filesystem-dependent), which produces huge, noisy
 * diffs on every re-sync even when nothing actually changed.
 *
 * Array element order is preserved (it is significant for `required`, `enum`,
 * proto field ordering, etc.); only object keys are reordered.
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
