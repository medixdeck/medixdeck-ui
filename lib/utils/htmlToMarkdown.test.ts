// @vitest-environment node
import { expect, it } from 'vitest';
import { htmlToMarkdown } from './htmlToMarkdown';

it('converts rich editor HTML without a browser DOM', () => {
  expect(typeof document).toBe('undefined');
  expect(
    htmlToMarkdown(
      '<h2>Guide</h2><p><strong>Care</strong> &amp; <em>rest</em>.</p><ul><li>One</li><li>Two</li></ul>',
    ),
  ).toBe('## Guide\n\n**Care** & *rest*.\n\n- One\n- Two');
});

it('preserves existing links, ordered lists, underlining and strike-through rules', () => {
  expect(
    htmlToMarkdown(
      '<p><a href="/faq?a=1&amp;b=2">Guide</a><br><u>Underline</u> <del>Old</del></p><ol><li>First</li><li>Second</li></ol>',
    ),
  ).toBe('[Guide](/faq?a=1&b=2)\n<u>Underline</u> ~~Old~~\n\n1. First\n2. Second');
  expect(htmlToMarkdown('Plain & text')).toBe('Plain & text');
  expect(htmlToMarkdown('')).toBe('');
});
