const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Privacy Policy and Terms display no revision date, in all three languages', () => {
  for (const language of ['pt', 'en', 'es']) {
    const translation = JSON.parse(read(`src/locales/${language}.json`));
    for (const page of ['privacy', 'terms']) {
      const text = translation[page].stages[0].paragraph;
      assert.doesNotMatch(text, /last updated|última actualización|última atualização|november 8|noviembre de 2026|novembro de 2026/i);
    }
    assert.doesNotMatch(translation.privacy.stages.at(-1).paragraph, /new revision date|nueva fecha de revisión|nova data de revisão/i);
    assert.match(translation.privacy.stages[0].paragraph, /hello@ericemanuel\.ee/);
  }
});

test('Legal stages preserve the original top alignment from stage.vue', () => {
  const view = read('src/views/danei/legal_document.vue');
  const stage = read('src/components/stage.vue');

  assert.match(view, /<main class="danei-legal-stages">/);
  assert.match(view, /<stage\b/);
  assert.match(view, /import stage from '@\/components\/stage\.vue'/);
  assert.match(view, /'deleteAccount'/);
  assert.match(view, /article\s*\{\s*margin-bottom:\s*40px;/);
  // The whole row is a fixed grid; the original stage controls vertical alignment.
  assert.match(view, /grid-template-columns:\s*324px 512px;/);
  assert.match(view, /column-gap:\s*64px;/);
  assert.doesNotMatch(view, /align-items\s*:/);
  assert.doesNotMatch(view, /margin-(?:top|bottom)\s*:\s*auto/);
  assert.doesNotMatch(view, /padding-top\s*:\s*0/);

  // The shared stage retains the label/title gap and paragraph offset.
  assert.match(stage, /flex-direction:\s*column;\s*gap:\s*8px;/);
  assert.match(stage, /align-items:\s*flex-start;/);
  assert.match(stage, /padding-top:\s*32px;/);
});
