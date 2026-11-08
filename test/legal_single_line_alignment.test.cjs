const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const view = read('src/views/danei/legal_document.vue');
const stage = read('src/components/stage.vue');

test('legal desktop rows have identical fixed columns, including short headings', () => {
  // Unscoped styles use a namespaced selector to reliably target stage children.
  assert.match(view, /<style>/);
  assert.doesNotMatch(view, /<style scoped>/);
  assert.match(view, /@media only screen and \(min-width: 900px\)/);
  assert.match(view, /\.danei-legal-stages > article > \.container\s*\{/);
  assert.match(view, /display: grid;/);
  assert.match(view, /grid-template-columns: 324px 512px;/);
  assert.match(view, /column-gap: 64px;/);
  assert.match(view, /justify-content: start;/);
  assert.equal(324 + 64 + 512, 900);
  assert.match(stage, /<div class="container">/);
  assert.match(stage, /width: 512px;/);
});

test('shared stage preserves original vertical and label spacing', () => {
  assert.match(view, /\.danei-legal-stages > article\s*\{\s*margin-bottom: 40px;/);
  assert.match(stage, /flex-direction: column;\s*gap: 8px;/);
  assert.match(stage, /padding-top: 32px;/);
  assert.doesNotMatch(view, /align-items\s*:\s*center/);
  assert.doesNotMatch(view, /padding-top\s*:/);
  assert.doesNotMatch(view, /margin-(?:top|bottom)\s*:\s*auto/);
});
