const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const locales = ['pt', 'en', 'es'];
const translations = Object.fromEntries(locales.map((locale) => [
  locale,
  JSON.parse(fs.readFileSync(path.join(root, `src/locales/${locale}.json`), 'utf8')),
]));

test('legal and support sections remain complete in every site language', () => {
  for (const section of ['privacy', 'terms', 'support']) {
    const expectedLength = translations.pt[section].stages.length;
    assert.ok(expectedLength > 0);
    for (const locale of locales) {
      const stages = translations[locale][section].stages;
      assert.equal(stages.length, expectedLength, `${locale} ${section} section count`);
      for (const stage of stages) {
        for (const key of ['label', 'title', 'paragraph']) {
          assert.ok(typeof stage[key] === 'string' && stage[key].trim(), `${locale} ${section} ${key}`);
        }
      }
    }
  }
});

test('terms route and cross-links point to real Danei pages', () => {
  const router = fs.readFileSync(path.join(root, 'src/router/index.js'), 'utf8');
  const view = fs.readFileSync(path.join(root, 'src/views/danei/terms.vue'), 'utf8');
  assert.match(router, /path: '\/danei\/terms'/);
  assert.match(router, /views\/danei\/terms\.vue/);
  assert.match(view, /document-key="terms"/);
  for (const locale of locales) {
    assert.match(translations[locale].terms.stages[0].paragraph, /#\/danei\/privacy/);
    assert.match(translations[locale].privacy.stages[9].paragraph, /#\/danei\/terms/);
    assert.match(translations[locale].support.stages[2].paragraph, /#\/danei\/terms/);
    assert.match(translations[locale].support.stages[2].paragraph, /#\/danei\/privacy/);
  }
});

test('policies cover shared data retention and subscription cancellation', () => {
  for (const locale of locales) {
    const privacy = translations[locale].privacy.stages;
    const terms = translations[locale].terms.stages;
    assert.ok(privacy.some((stage) => /Firebase/.test(stage.paragraph)));
    assert.ok(privacy.some((stage) => /iCloud/.test(stage.paragraph)));
    assert.ok(privacy.some((stage) => /Qonversion/.test(stage.paragraph)));
    assert.ok(privacy.some((stage) => /Google Drive/.test(stage.paragraph)));
    assert.ok(terms.some((stage) => /Google Play/.test(stage.paragraph) && /App Store/.test(stage.paragraph)));
  }
});


test('legal pages reuse the existing stage layout and native app spacing', () => {
  for (const kind of ['terms', 'privacy']) {
    const view = fs.readFileSync(path.join(root, `src/views/danei/${kind}.vue`), 'utf8');
    assert.match(view, /LegalDocument/);
    assert.match(view, new RegExp(`document-key="${kind}"`));
  }

  const view = fs.readFileSync(path.join(root, 'src/views/danei/legal_document.vue'), 'utf8');
  const stage = fs.readFileSync(path.join(root, 'src/components/stage.vue'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/App.vue'), 'utf8');

  assert.match(view, /import stage from '@\/components\/stage\.vue'/);
  assert.match(view, /v-for="\(item, index\) in stages"/);
  assert.match(view, /<main class="danei-legal-stages">/);
  assert.match(view, /article\s*\{\s*margin-bottom: 40px;/);
  // Preserve the original component's label, heading, and paragraph alignment.
  assert.match(view, /grid-template-columns:\s*324px 512px;/);
  assert.match(view, /column-gap:\s*64px;/);
  assert.doesNotMatch(view, /align-items:/);
  assert.doesNotMatch(view, /padding-top:/);
  assert.match(stage, /padding-top: 32px/);
  assert.doesNotMatch(view, /useI18n\s*\(/);
  assert.match(view, /this\.\$i18n\.messages/);
  assert.match(stage, /<article>/);
  assert.match(app, /gap: 144px/);
  assert.match(app, /gap: 240px/);
});

test('public Danei pages avoid version numbers in visible copy', () => {
  for (const locale of locales) {
    for (const section of ['privacy', 'terms', 'support']) {
      for (const item of translations[locale][section].stages) {
        for (const key of ['label', 'title', 'paragraph']) {
          assert.doesNotMatch(item[key], /Danei\s+3\.0/, `${locale} ${section} ${key}`);
        }
      }
    }
  }
});

test('language circle tracks identical centered cells', () => {
  const top = fs.readFileSync(path.join(root, 'src/components/top.vue'), 'utf8');
  assert.match(top, /--language-size: 24px/);
  assert.match(top, /--language-step: calc\(var\(--language-size\) \+ var\(--language-gap\)\)/);
  assert.match(top, /justify-content: center/);
  assert.match(top, /align-items: center/);
  assert.match(top, /padding: 0/);
  assert.match(top, /transform:\s*translateY\(/);
  assert.match(top, /\.pt \.circle \{ left: var\(--language-step\)/);
  assert.match(top, /\.es \.circle \{ left: calc\(var\(--language-step\) \* 2\)/);
});
