import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToString } from 'react-dom/server';

async function main() {
  assert.equal(typeof window, 'undefined', 'The package check must run without a DOM');
  assert.equal(typeof document, 'undefined', 'Do not install a DOM shim for this test');

  const esm = await import('../dist/index.js');

  function themeFixture(ui) {
    function ThemeProbe() {
      const { themeMode, themeSetting, mounted } = ui.useThemeMode();
      return React.createElement(
        'output',
        { 'data-ssr-theme': true },
        `${themeMode}|${themeSetting}|${mounted}`,
      );
    }
    return React.createElement(
      ui.MedixProvider,
      { defaultColorMode: 'light' },
      React.createElement(ThemeProbe),
    );
  }

  if (process.argv.includes('--theme-fixture')) {
    console.log(JSON.stringify({ html: renderToString(themeFixture(esm)) }));
  } else {
    const cjs = createRequire(import.meta.url)('../dist/index.cjs');
    for (const [format, ui] of [
      ['ESM', esm],
      ['CommonJS', cjs],
    ]) {
      const html = renderToString(
        React.createElement(
          ui.MedixProvider,
          { defaultColorMode: 'light' },
          React.createElement(ui.Navbar, {
            navItems: [{ label: 'Resources', children: [{ label: 'Health Blog', href: '/blog' }] }],
          }),
          React.createElement(ui.Accordion, {
            defaultOpenIds: ['html'],
            items: [
              {
                id: 'html',
                question: 'HTML answer',
                answer:
                  '<p>SSR <strong>safe answer</strong><script>alert(1)</script><img src="/image.png" onerror="alert(2)"></p>',
              },
            ],
          }),
          React.createElement(ui.Accordion, {
            answerType: 'MD',
            defaultOpenIds: ['md'],
            items: [
              {
                id: 'md',
                question: 'Markdown answer',
                answer: '**SSR Markdown** &copy; &amp; café',
              },
            ],
          }),
          React.createElement(ui.RichTextInput, {
            label: 'SSR editor',
            defaultValue: '<p>Initial draft</p>',
            persistDraft: false,
          }),
          React.createElement(ui.PhoneInput, { label: 'SSR phone', name: 'phone' }),
          React.createElement(ui.RichTextInput, {
            label: 'SSR markdown editor',
            defaultMode: 'markdown',
            defaultValue: '<p><strong>Initial draft</strong></p>',
            persistDraft: false,
          }),
          React.createElement(ui.CookieConsentBanner),
          React.createElement(ui.Footer, { description: 'SSR footer content' }),
        ),
      );
      assert(html.includes('Main navigation'), `${format}: navigation renders on the server`);
      assert(
        html.includes('<strong>safe answer</strong>'),
        `${format}: rich answer is server-rendered`,
      );
      assert(
        html.includes('<strong>SSR Markdown</strong>'),
        `${format}: Markdown renders without document`,
      );
      assert(html.includes('©') && html.includes('café'), `${format}: entities and Unicode render`);
      assert(
        html.includes('**Initial draft**'),
        `${format}: Markdown mode converts initial HTML during SSR`,
      );
      assert(
        !html.includes('alert(1)') && !html.includes('onerror'),
        `${format}: unsafe HTML is removed`,
      );
      assert(
        html.includes('SSR editor') && html.includes('SSR footer content'),
        `${format}: editor shell and footer render`,
      );
      assert(!html.includes('__name'), `${format}: serialized theme script has no bundler helpers`);
      assert(
        renderToString(themeFixture(ui)).includes('light|system|false'),
        `${format}: deterministic initial theme`,
      );
      console.log(`${format} built-package import and SSR render passed without window/document`);
    }
  }
}

main().catch((error) => {
  console.error(error.stack ?? String(error));
  process.exitCode = 1;
});
