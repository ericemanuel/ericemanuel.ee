const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const locales = ['pt', 'en', 'es'];
const source = (name) => fs.readFileSync(path.join(root, name), 'utf8');

const texts = Object.fromEntries(locales.map((locale) => [
  locale,
  JSON.parse(source(`src/locales/${locale}.json`)),
]));

test('public deletion route reuses the existing legal stage layout', () => {
  assert.match(source('src/router/index.js'), /path: '\/danei\/delete-account'/);
  assert.match(source('src/views/danei/delete_account.vue'), /document-key="deleteAccount"/);
  assert.match(source('src/views/danei/legal_document.vue'), /'deleteAccount'/);
  assert.match(source('src/views/danei/legal_document.vue'), /import stage from '@\/components\/stage.vue'/);
});

test('each available language offers an email deletion request without the app', () => {
  for (const locale of locales) {
    const stages = texts[locale].deleteAccount.stages;
    assert.equal(stages.length, texts.pt.deleteAccount.stages.length);
    assert.ok(stages.length >= 4);
    for (const item of stages) {
      for (const field of ['label', 'title', 'paragraph']) {
        assert.equal(typeof item[field], 'string');
        assert.ok(item[field].trim(), `${locale}: ${field}`);
        assert.doesNotMatch(item[field], /Danei 3\.0/);
      }
    }
    assert.match(stages[0].paragraph, /mailto:hello@ericemanuel\.ee\?subject=/);
    assert.match(stages[0].paragraph, /<a href=/);
    assert.ok(stages.some(({paragraph}) => /Google Drive/.test(paragraph) && /iCloud/.test(paragraph)));
    assert.ok(stages.some(({paragraph}) => /Google Play/.test(paragraph) && /App Store/.test(paragraph)));
    assert.match(texts[locale].support.stages[3].paragraph, /#\/danei\/delete-account/);
    assert.match(texts[locale].privacy.stages[9].paragraph, /#\/danei\/delete-account/);
  }
});


test('privacy contact and deletion information are consistent across translations', () => {
  for (const locale of locales) {
    const privacy = texts[locale].privacy.stages;
    const allContent = JSON.stringify(texts[locale]);
    assert.doesNotMatch(allContent, /ericemanuel@gmail\.com/);
    assert.match(privacy[0].paragraph, /Eric Emanuel/);
    assert.match(privacy[0].paragraph, /mailto:hello@ericemanuel\.ee/);
    assert.match(privacy[9].paragraph, /mailto:hello@ericemanuel\.ee/);
    assert.match(privacy[9].paragraph, /#\/danei\/terms/);
    assert.match(privacy[9].paragraph, /#\/danei\/delete-account/);
    assert.match(privacy[8].paragraph, /Google|lojas|stores|tiendas/i);
    assert.match(privacy[8].paragraph, /compartilhados|shared|compartidos/i);
  }
});
