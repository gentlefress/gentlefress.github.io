# Zhe Li's homepage

This repository contains the **exported Next.js website** served by GitHub Pages
at https://gentlefress.github.io. The original PRISM source project and build
configuration are not included here.

Preview the export with `python3 -m http.server 8765` and open
http://localhost:8765. There is no npm build step in this repository.

## Publications and news

The homepage displays News followed by Publications, grouped by year. Each paper
has a framework figure, full author list, venue, contribution notes, and available
paper/project/code/DOI links. BibTeX expands inline; figures open at full size.
Education and Experience follow the publication list. The navigation's
Publications link points to `/#publications`; `/publications/` remains available
with its searchable list.

The current list contains 20 papers. The TCSS Tucker Fusion and ICASSP Lightweight
NeRF papers are omitted at the owner's request. ViP uses the owner's supplied
framework image.

Content exists in both the visible HTML and the Next.js Flight data embedded
in that HTML. Each route's `index.txt` also contains Flight data used when
navigating between pages. Keep all three representations in sync when editing
this export, or content may revert after hydration or navigation.

The active publication component supports `paperUrl` for direct PDFs and
publisher links, in addition to the existing arXiv and project homepage links.
Changed JavaScript chunks use new filenames so browsers load the updated code.

### Maintaining the homepage list

- [`publications/index.txt`](publications/index.txt) contains the publication
  metadata. When changing it, also synchronize the publication route's HTML and
  embedded Flight data as described above.
- [`papers/frameworks/sources.json`](papers/frameworks/sources.json) maps paper IDs
  to local figure files and records the original image or PDF source. Add a figure
  entry for each new publication.
- [`assets/home-publications.css`](assets/home-publications.css) defines the layout
  for desktop, mobile, and dark mode.
- [`scripts/homepage-component.js`](scripts/homepage-component.js) contains the
  homepage component inserted into the existing exported JavaScript chunk.

After updating those files, run `python3 scripts/render-home-publications.py`.
This standard-library-only helper regenerates the homepage publication markup,
keeps its HTML and Flight data synchronized, and updates the CSS/JavaScript asset
filenames and their references. Repeating the command leaves the output unchanged.
Preview both direct page loads and navigation from another route before publishing.

Lowercase omega (ω) uses the local `assets/fonts/homepage-greek.woff2` glyph subset
of [Noto Sans Math](https://github.com/google/fonts/tree/main/ofl/notosansmath).
Its SIL Open Font License is included alongside the font. The subset covers only
U+03C9, so other characters retain the site's existing fonts.

## CV

The navigation opens [`Zhe_Li_CV.pdf`](Zhe_Li_CV.pdf) directly in a new tab using a
native link. Replace that file to update the CV. The former `/cv/` page redirects
to the PDF, and the old generated CV content is removed.

## WeChat contact

The profile's WeChat icon opens the original QR image in a native dialog.
[`assets/wechat-contact.js`](assets/wechat-contact.js) handles opening, closing,
and keyboard focus. [`assets/wechat-qr.jpg`](assets/wechat-qr.jpg) is the uploaded
image, copied without editing. Replace it when the contact QR code changes.
The `wechat_qr` social field enables the icon; keep the HTML and Flight data
in sync when changing it.

## Visitor counter

The homepage's profile sidebar displays `Visitors`, `10/2000`, and
`Today / Total` in place of the former Like button. The footer does not repeat
the counter. The shared layout still records direct visits to every route.
[`assets/visitor-counter.js`](assets/visitor-counter.js) requests the global
`busuanzi_today_uv` and `busuanzi_site_uv` counters from the public endpoint used
by [Busuanzi's official 3.6.9 client](https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js).
See the [service documentation](https://www.busuanzi.cc/doc.php) for its
statistics definitions.

- The service stores the counts across browsers and devices. No browser-local
  counter or preset total is used.
- UV counts are deduplicated by the service within a day. Today's count resets
  at the service's midnight; the cumulative count continues to grow. These are
  visitor statistics, rather than a count of every refresh.
- Statistics start when the service is first connected; earlier untracked
  visits cannot be recovered.
- Only `gentlefress.github.io` sends requests. Local previews display `--/--`
  and do not affect the published site's statistics. Update the hostname check
  if the website moves to a custom domain.
- Navigation reuses the current request. Failed or invalid responses display
  `--/--`; requests time out after 10 seconds.

Publishing the updated export through the existing GitHub Pages workflow makes
the counter available to visitors. The public statistics service requires no
API key or separate backend deployment.

If regenerating the website from the original PRISM source, carry these content
and component changes into that source first; a fresh export can overwrite edits
made here.
