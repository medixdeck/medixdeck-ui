import { describe, expect, it } from 'vitest';
import { sanitizeHtml } from './sanitizeHtml';
import { parseDocument } from 'htmlparser2';
import legacyHtml from './fixtures/legacyHtml.json';

function canonicalHtml(value: string) {
  type HtmlNode = ReturnType<typeof parseDocument>['children'][number];
  function canonical(node: HtmlNode): unknown {
    if (node.type === 'text') return node.data;
    if ('name' in node && 'children' in node)
      return {
        name: node.name,
        attributes: Object.entries(node.attribs).sort(([a], [b]) => a.localeCompare(b)),
        children: node.children.map(canonical),
      };
    return null;
  }
  return parseDocument(value).children.map(canonical);
}

describe('universal rich HTML sanitizer', () => {
  for (const example of legacyHtml.examples)
    it(`matches the historical sanitizer for ${example.input.slice(0, 50)}`, () => {
      expect(canonicalHtml(sanitizeHtml(example.input))).toEqual(canonicalHtml(example.expected));
    });
  it('preserves rich text, images, tables, entities and safe formatting', () => {
    const html =
      '<h2>Café &amp; care</h2><p style="text-align:center;color:#0685FF">Read <strong>this</strong> <a href="/faq">answer</a>.</p><ul><li>One</li></ul><table><tbody><tr><td>Cell</td></tr></tbody></table><img src="https://example.test/image.png" alt="Guide" width="100" />';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('removes active content, event handlers and encoded script URLs', () => {
    const html = sanitizeHtml(
      '<script>alert(1)</script><iframe src="https://example.test"></iframe><img src="/image.png" onerror="alert(2)"><a href="jav&#x61;script:alert(3)">Read</a>',
    );
    expect(html).not.toMatch(/script|iframe|onerror|alert/);
    expect(html).toContain('Read</a>');
  });

  it('retains existing SVG diagrams, MathML, forms and authored CSS', () => {
    const html = sanitizeHtml(
      '<div><style>.answer { padding: 4px }</style><p class="answer" style="display:grid;gap:12px;--accent:#0685ff">Care</p><svg viewBox="0 0 10 10"><defs><linearGradient id="gradient"><stop offset="0%" stop-color="blue" /></linearGradient></defs><circle cx="5" cy="5" r="4" fill="url(#gradient)" /></svg><math><mfrac><mn>1</mn><mn>2</mn></mfrac></math><form action="/search" method="get"><label for="query">Search</label><input id="query" name="query" required><button type="submit">Go</button></form></div>',
    );
    expect(html).toContain('<style>.answer { padding: 4px }</style>');
    expect(html).toContain('style="display:grid;gap:12px;--accent:#0685ff"');
    expect(html).toContain('<svg viewbox="0 0 10 10">');
    expect(html).toContain('<lineargradient id="gradient">');
    expect(html).toContain('fill="url(#gradient)"');
    expect(html).toContain('<math><mfrac><mn>1</mn><mn>2</mn></mfrac></math>');
    expect(html).toContain('<form action="/search" method="get">');
    expect(html).toContain('name="query"');
    expect(html).toContain('required');
  });

  it('retains protocol-relative, data-image and extended safe link schemes', () => {
    const html = sanitizeHtml(
      '<img src="//cdn.example.test/a.png"><img src="data:image/png;base64,YQ=="><a href="sms:+123">Text</a><a href="ftp://example.test/file">File</a>',
    );
    expect(html).toContain('src="//cdn.example.test/a.png"');
    expect(html).toContain('src="data:image/png;base64,YQ=="');
    expect(html).toContain('href="sms:+123"');
    expect(html).toContain('href="ftp://example.test/file"');
  });

  it('rejects executable URLs and handlers in foreign and malformed markup', () => {
    for (const input of [
      '<svg><a xlink:href="javascript:alert(1)"><circle onload="alert(1)" /></a></svg>',
      '<svg><textarea><img src=x onerror=alert(1)></textarea></svg>',
      '<math><mtext><img src=x onerror=alert(1)></mtext></math>',
      '<form action="javascript:alert(1)"><input onclick="alert(1)"></form>',
      '<svg><animatetransform attributeName="href" values="#safe;javascript:alert(1)" /></svg>',
    ]) {
      expect(sanitizeHtml(input)).not.toMatch(/onerror|onload|onclick|javascript:|alert\(1\)/i);
    }
  });

  it('normalizes malformed markup consistently and is idempotent', () => {
    const once = sanitizeHtml('<p>Text <strong>important</p><p>Next &copy;');
    expect(sanitizeHtml(once)).toBe(once);
    expect(once).toContain('important');
    expect(once).toContain('©');
  });

  it('retains authored anchors while preventing document/form name clobbering', () => {
    const html = sanitizeHtml(
      '<form id="attributes"><input name="submit"><p id="answer-heading">Answer</p></form>',
    );
    expect(html).not.toContain('id="attributes"');
    expect(html).not.toContain('name="submit"');
    expect(html).toContain('id="answer-heading"');
  });
});
