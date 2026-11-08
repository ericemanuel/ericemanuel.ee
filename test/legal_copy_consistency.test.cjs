const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const locales = ['pt', 'en', 'es'];
const pages = ['privacy', 'terms', 'deleteAccount'];
const text = Object.fromEntries(locales.map((locale) => [
  locale,
  JSON.parse(fs.readFileSync(path.join(root, `src/locales/${locale}.json`), 'utf8')),
]));

const join = (locale, page) => text[locale][page].stages.map((stage) =>
  `${stage.label} ${stage.title} ${stage.paragraph}`).join(' ');

test('all three legal pages have the same section counts and valid text per language', () => {
  for (const page of pages) {
    const count = text.en[page].stages.length;
    for (const locale of locales) {
      assert.equal(text[locale][page].stages.length, count);
      for (const stage of text[locale][page].stages) {
        for (const field of ['label', 'title', 'paragraph']) {
          assert.ok(typeof stage[field] === 'string' && stage[field].trim());
          assert.doesNotMatch(stage[field], /Danei\s+3\.0|ericemanuel@gmail\.com/i);
        }
      }
    }
  }
});

test('all languages use a single contact and connect the three pages', () => {
  for (const locale of locales) {
    for (const page of pages) {
      const contents = join(locale, page);
      assert.doesNotMatch(contents, /ericemanuel@gmail\.com|utm_source=|last updated|última actualización|última atualização/i);
      assert.match(contents, /danei@ericemanuel\.ee/);
    }
    assert.match(join(locale, 'privacy'), /#\/danei\/terms/);
    assert.match(join(locale, 'privacy'), /#\/danei\/delete-account/);
    assert.match(join(locale, 'terms'), /#\/danei\/privacy/);
    assert.match(join(locale, 'terms'), /#\/danei\/delete-account/);
    assert.match(join(locale, 'deleteAccount'), /#\/danei\/privacy/);
    assert.match(join(locale, 'deleteAccount'), /mailto:danei@ericemanuel\.ee\?subject=/);
  }
});

test('deletion, shared records, backups and store billing stay consistent', () => {
  for (const locale of locales) {
    for (const page of pages) {
      const contents = join(locale, page);
      assert.match(contents, /Google Play/);
      assert.match(contents, /App Store/);
    }
    assert.match(join(locale, 'privacy'), /Firebase/);
    assert.match(join(locale, 'privacy'), /Qonversion/);
    for (const page of ['privacy', 'deleteAccount']) {
      assert.match(join(locale, page), /Google Drive/);
      assert.match(join(locale, page), /iCloud/);
    }
    assert.match(join(locale, 'deleteAccount'), /Google Play/);
  }
});

test('no legal copy contains empty links or unbalanced anchors', () => {
  for (const locale of locales) for (const page of pages) {
    for (const stage of text[locale][page].stages) {
      assert.equal((stage.paragraph.match(/<a\b/g) || []).length,
                   (stage.paragraph.match(/<\/a>/g) || []).length,
                   `${locale}/${page}: unbalanced anchors`);
      assert.doesNotMatch(stage.paragraph, /href=""/);
    }
  }
});
