# Zhe Li's homepage

This repository contains the **exported Next.js website** served by GitHub Pages
at https://gentlefress.github.io. The original PRISM source project and build
configuration are not included here.

Preview the export with `python3 -m http.server 8765` and open
http://localhost:8765. There is no npm build step in this repository.

## Publications and news

The September 2026 update adds RoboDreamer (CoRL 2026), a paper link for every
publication, and news for RoboDreamer and the Omega-Home dataset release.

Content exists in both the visible HTML and the Next.js Flight data embedded
in that HTML. Each route's `index.txt` also contains Flight data used when
navigating between pages. Keep all three representations in sync when editing
this export, or content may revert after hydration or navigation.

The active publication component supports `paperUrl` for direct PDFs and
publisher links, in addition to the existing arXiv and project homepage links.
Changed JavaScript chunks use new filenames so browsers load the updated code.

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
