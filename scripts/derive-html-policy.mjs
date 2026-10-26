// Maintenance helper: derive the historical DOMPurify vocabulary from a local
// installed distribution. Never used by the published runtime.
// Usage: node scripts/derive-html-policy.mjs /absolute/path/to/node_modules/dompurify
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sourceDir = process.argv[2];
if (!sourceDir) throw new Error('Pass an installed DOMPurify directory');
const source = readFileSync(path.join(sourceDir, 'dist/purify.es.mjs'), 'utf8');
const version = JSON.parse(readFileSync(path.join(sourceDir, 'package.json'), 'utf8')).version;
function vocabulary(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`const ${escaped} = freeze\\((\\[[^;]*?\\])\\);`));
  if (!match) throw new Error(`Missing DOMPurify vocabulary: ${name}`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1].toLowerCase());
}
const tags = [...new Set(['html$1', 'svg$1', 'svgFilters', 'mathMl$1'].flatMap(vocabulary))];
const attributes = [...new Set(['html', 'svg', 'mathMl', 'xml'].flatMap(vocabulary))];
// Capture the document/form bindings DOMPurify protects from named-property
// clobbering. The runtime uses a fixed set, never a browser-global probe.
// A sibling jsdom installation is required only to regenerate this source file.
const { JSDOM } = await import(pathToFileURL(path.join(sourceDir, '../jsdom/lib/api.js')).href);
const reference = new JSDOM('');
const reservedNames = new Set();
for (const instance of [
  reference.window.document,
  reference.window.document.createElement('form'),
]) {
  for (let current = instance; current; current = Object.getPrototypeOf(current)) {
    for (const key of Object.getOwnPropertyNames(current)) reservedNames.add(key);
  }
}
const { default: createDOMPurify } = await import(
  pathToFileURL(path.join(sourceDir, 'dist/purify.es.mjs')).href
);
const purify = createDOMPurify(reference.window);
const examples = [
  '<div><h2 id="answer-heading">Care &amp; advice</h2><p class="answer" style="display:grid;gap:12px;--accent:#0685ff">Text <strong>bold</strong> <u>underlined</u></p><style>.answer { padding: 4px }</style></div>',
  '<svg viewBox="0 0 10 10"><defs><linearGradient id="gradient"><stop offset="0%" stop-color="blue" /></linearGradient></defs><circle cx="5" cy="5" r="4" fill="url(#gradient)" /></svg>',
  '<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mn>1</mn><mn>2</mn></mfrac></math>',
  '<form action="/search" method="get"><label for="query">Search</label><input id="query" name="query" required><button type="submit">Go</button></form>',
  '<picture><source srcset="//cdn.example.test/a.webp 1x, //cdn.example.test/b.webp 2x"><img src="data:image/png;base64,YQ==" alt="Guide"></picture><a href="sms:+123">Text</a><a href="ftp://example.test/file">File</a>',
  '<table><tbody><tr><th scope="row">Advice</th><td colspan="2" data-note="yes" aria-label="Care">Cell</td></tr></tbody></table>',
  '<form id="attributes"><input name="submit"><a href="javascript:alert(1)" onclick="alert(1)">Read</a><script>alert(1)</script></form>',
];
mkdirSync('lib/utils/fixtures', { recursive: true });
writeFileSync(
  'lib/utils/fixtures/legacyHtml.json',
  JSON.stringify(
    {
      reference: `DOMPurify ${version}, default configuration, jsdom`,
      examples: examples.map((input) => ({ input, expected: purify.sanitize(input) })),
    },
    null,
    2,
  ) + '\n',
);
reference.window.close();
const header = `// DOMPurify ${version} default tag/attribute vocabulary, adapted for HTML fragments.\n// Copyright Cure53 and other contributors. Apache-2.0; see third-party/DOMPurify-LICENSE.\n// Regenerate with scripts/derive-html-policy.mjs; never derive at runtime.\n`;
writeFileSync(
  'lib/utils/htmlPolicy.ts',
  `${header}\nexport const htmlTags = ${JSON.stringify(tags, null, 2)};\n\nexport const htmlAttributes = ${JSON.stringify(attributes, null, 2)};\n\n// Standard document/form property names protected against DOM clobbering.\nexport const reservedHtmlNames = new Set(${JSON.stringify([...reservedNames].sort(), null, 2)});\n`,
);
mkdirSync('third-party', { recursive: true });
writeFileSync('third-party/DOMPurify-LICENSE', readFileSync(path.join(sourceDir, 'LICENSE')));
writeFileSync(
  'third-party/NOTICE',
  `The HTML sanitizer vocabulary in lib/utils/htmlPolicy.ts is adapted from DOMPurify ${version}.\nCopyright Cure53 and other contributors. Licensed under Apache-2.0.\nhttps://github.com/cure53/DOMPurify\nThe DOMPurify implementation is not included in the runtime.\n`,
);
