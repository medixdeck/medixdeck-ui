import sanitize from 'sanitize-html';
import { htmlAttributes, htmlTags, reservedHtmlNames } from './htmlPolicy';

const schemes = [
  'http',
  'https',
  'ftp',
  'ftps',
  'mailto',
  'tel',
  'callto',
  'sms',
  'cid',
  'xmpp',
  'matrix',
];
const mediaSchemes = [...schemes, 'data'];

/**
 * One DOM-free parser on server and client. Retain the previous DOMPurify tag
 * and attribute vocabulary, SVG/MathML, forms, inline CSS, and media URLs.
 * This is compatibility-oriented, not byte-for-byte DOMPurify equivalence.
 */
export function sanitizeHtml(value: string): string {
  return sanitize(value, {
    allowedTags: htmlTags.filter((tag) => !['html', 'head', 'body'].includes(tag)),
    allowedAttributes: { '*': [...htmlAttributes, 'aria-*', 'data-*'] },
    transformTags: {
      '*': (tagName, attribs) => {
        for (const name of ['id', 'name'])
          if (reservedHtmlNames.has(attribs[name])) delete attribs[name];
        // htmlparser2 canonicalizes foreign names such as linearGradient.
        // Compare them with the historical lowercase vocabulary; HTML fragment
        // parsing restores SVG's canonical casing when inserted in the page.
        return { tagName: tagName.toLowerCase(), attribs };
      },
    },
    // Preserve authored CSS as DOMPurify did; do not impose a new design policy.
    parseStyleAttributes: false,
    allowVulnerableTags: true, // The historical style tag is allowed, never script.
    allowedSchemes: schemes,
    allowedSchemesByTag: Object.fromEntries(
      ['audio', 'video', 'img', 'source', 'image', 'track'].map((tag) => [tag, mediaSchemes]),
    ),
    allowedSchemesAppliedToAttributes: [
      'href',
      'src',
      'srcset',
      'xlink:href',
      'action',
      'background',
      'cite',
      'poster',
    ],
    allowProtocolRelative: true,
    nonTextTags: ['script', 'iframe', 'noembed', 'noframes', 'noscript', 'plaintext', 'xmp'],
  });
}
