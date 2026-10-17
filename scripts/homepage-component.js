// This function is inserted into the exported home-page chunk by the build helper.
// r, l, V, A, _, R and I are the existing export's JSX/runtime/components.
function H(e) {
  const { dataByLocale, defaultLocale } = e;
  const locale = (0, V.D)(state => state.locale);
  const data = dataByLocale[locale] || dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const publicationsRef = (0, l.useRef)(null);
  (0, l.useEffect)(() => {
    const section = publicationsRef.current;
    if (!section) return;
    const links = Array.from(section.querySelectorAll('[data-pub-filter]'));
    const rows = Array.from(section.querySelectorAll('.pub-row'));
    const years = Array.from(section.querySelectorAll('.pub-year'));
    const count = section.querySelector('.pub-count');
    const applyFilter = filter => {
      let visible = 0;
      rows.forEach(row => {
        row.hidden = filter !== 'all' && !row.dataset.pubCategories.split(' ').includes(filter);
        if (!row.hidden) visible += 1;
      });
      years.forEach(year => { year.hidden = !year.querySelector('.pub-row:not([hidden])'); });
      links.forEach(link => {
        if (link.dataset.pubFilter === filter) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      if (count) count.textContent = `${visible} ${visible === 1 ? 'paper' : 'papers'}`;
    };
    const syncLocation = () => {
      const active = links.find(link => link.hash === window.location.hash);
      applyFilter(active ? active.dataset.pubFilter : 'all');
      if (active) section.scrollIntoView({ block: 'start', behavior: 'instant' });
    };
    // The shared Next.js navbar can update the hash without a hashchange event.
    const resetFromNavigation = event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a');
      if (link && link.getAttribute('href') === '/#publications') applyFilter('all');
    };
    window.addEventListener('hashchange', syncLocation);
    window.addEventListener('popstate', syncLocation);
    document.addEventListener('click', resetFromNavigation);
    const frame = window.requestAnimationFrame(syncLocation);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', syncLocation);
      window.removeEventListener('popstate', syncLocation);
      document.removeEventListener('click', resetFromNavigation);
    };
  }, [data && data.publicationsHtml]);
  if (!data) return null;
  const sections = data.pagesToShow.find(page => page.type === "about").sections;
  return (0, r.jsxs)("div", {
    className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen homepage",
    children: [
      (0, r.jsxs)("div", {
        className: "homepage-intro",
        children: [
          (0, r.jsx)("aside", {
            className: "homepage-profile",
            children: (0, r.jsx)(A, {
              author: data.author, social: data.social,
              features: data.features, researchInterests: data.researchInterests
            })
          }),
          (0, r.jsx)("div", {
            className: "homepage-overview",
            children: sections.filter(section => section.type === "markdown" || section.type === "list").map(section =>
              (0, r.jsx)("section", {
                id: section.id,
                className: "scroll-mt-24",
                children: section.type === "markdown"
                  ? (0, r.jsx)(_, { content: section.content || "", title: section.title })
                  : (0, r.jsx)(R, { items: section.items || [], title: section.title })
              }, section.id)
            )
          })
        ]
      }),
      (0, r.jsx)("section", {
        ref: publicationsRef,
        id: "publications", className: "home-publications", "aria-labelledby": "publications-heading",
        dangerouslySetInnerHTML: { __html: data.publicationsHtml || "" }
      }),
      (0, r.jsx)("div", {
        className: "homepage-background",
        children: sections.filter(section => section.type === "card").map(section =>
          (0, r.jsx)("section", {
            id: section.id,
            children: (0, r.jsx)(I.A, { config: section.config, embedded: true })
          }, section.id)
        )
      })
    ]
  });
}
