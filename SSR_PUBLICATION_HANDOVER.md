# Shared UI SSR publication handover

Updated 26 October 2026. Current candidate: **0.1.27-ssr.0**, unpublished.
The owner will publish npm after the website's local-tarball validation finishes.
The website will then move to the exact published registry version. No publication,
Git commit/push, production deployment or account change has been performed here.

## What changed

- Build universal dependency entries rather than embedding browser-only Markdown
  entity decoding or DOM-based sanitizer initialization in the package barrel.
- Keep ESM and CommonJS outputs usable, including default-export interop for
  TipTap and the bundled legacy CommonJS components.
- Use one DOM-free HTML sanitizer on server and browser. At the owner's request,
  retain the historical DOMPurify tag/attribute vocabulary, including SVG,
  MathML, forms, authored CSS and media. Normalize foreign tag names against the
  vocabulary so SVG gradients survive. Filter scripts, handlers, unsafe URLs,
  frames and known document/form clobbering names. Malformed HTML normalization
  can differ; this is not a claim of complete DOMPurify equivalence.
- Include the derived vocabulary's license and attribution in the npm package.
- Make the first theme-hook render deterministic, then restore saved preferences
  after mounting. There is no global loading screen or skeleton.
- Own the pre-hydration theme script as literal source. Keep next-themes preference
  management; make its duplicate bootstrap inert through its public API. A
  consuming application no longer needs to rewrite compiled dependency code.
- Create TipTap's DOM-backed editor after hydration and convert initial editor
  HTML to Markdown without document/Node globals.

Navbar, footer, theme tokens and their visual/interaction source are unchanged
from v0.1.25. No proposed pointer-click behavior substitution was retained.

## Completed library verification

Environment: Node 24.19.0; React and React DOM 19.2.5. The declared runtime minimum
is Node 20.19.0, matching the parser dependency. Other declared framework/React
versions have not all been independently exercised.

| Check | Result |
| --- | --- |
| Production build and declarations | Passed |
| Actual built ESM and CommonJS import/render without window or document | Both passed |
| Unit/component/hydration tests | 97 passed across 13 files |
| Sanitizer/reference compatibility checks | 14 passed, included in the 97 |
| Saved-dark-mode hydration from real Node SSR HTML | Passed, included in the 97 |
| Package content inspection | Passed: 17 files, about 1.4 MB packed / 7.1 MB unpacked |

The passing test suite emits React `act(...)` warnings in existing component tests;
those are test-harness warnings, not evidence of a browser hydration pass. Do not
suppress console errors to conceal a failure. The website's separate validation
record distinguishes its runtime/browser checks from these library checks.

Logs are local ignored `ssr-resume-build.log`, `ssr-resume-runtime.log`,
`ssr-resume-tests.log`, `ssr-resume-pack.log`. Packaging used HUSKY=0 and a
workspace-local npm cache because the agent's Git hooks/global cache locations
were read-only; no Git hooks or security settings were changed.

The checked temporary website artifact is
`../website/vendor/medixdeck-ui-0.1.27-ssr.0.tgz`.
SHA-256: `aee5d1b33e4018248ca4a90f89a132b68fb1c538781f4058aa954fb949b7e1d7`.
Do not overwrite that artifact after changing source or package contents without
reinstalling it in the website and refreshing the lockfile integrity.

## Owner publication sequence

First read the latest website results in
`../website/docs/CLOUDFLARE_PAGES_VALIDATION.md` and the integration details in
`../website/docs/SHARED_UI_SSR.md`. A local test package is not a published release.

Choose the intended release version/tag explicitly. The current version is a
prerelease candidate. To publish this exact candidate under an explicit `ssr`
tag, run the following yourself after reviewing the results and authenticating
with your existing npm account:

```sh
npm run build
npm test
npm run test:ssr
npm run pack:check
npm publish --access public --tag ssr
npm view @medixdeck/ui@0.1.27-ssr.0 version dist.integrity
```

If you want a stable release instead, first choose an unused stable version and
update package.json and package-lock.json together, then repeat build/tests/pack
inspection and publish with the intended tag. No stable version or latest-tag
change has been selected on your behalf. npm does not permit reusing a published
name/version combination, and its default publish tag is latest.
[Official npm publishing documentation](https://docs.npmjs.com/cli/v11/commands/npm-publish/).

The existing production-branch workflow also publishes npm. Choose one publishing
path; do not publish the same version manually and then expect the workflow to
publish it again. Review its tag behavior before pushing a prerelease candidate.

After publication, provide the exact published version. The website update is:

```sh
npm install @medixdeck/ui@PUBLISHED_VERSION --save-exact
```

This is a placeholder for the actual version, not a command to run unchanged.
Then verify the registry dependency/lockfile, remove the temporary tarball when
it is no longer referenced, and repeat the website checks before production use.
No npm token, password or OTP needs to be pasted into this chat.

## Future maintenance

Build dist normally; never hand-edit it or patch a consumer's node_modules.
`scripts/derive-html-policy.mjs` is an optional maintenance helper that reads a
specified installed DOMPurify 3.4.9 distribution and its sibling jsdom reference
installation to regenerate the vocabulary and fixtures. Those reference packages
are not runtime dependencies and regeneration is not needed for normal builds.
Preserve the third-party license/NOTICE when updating the derived vocabulary.
