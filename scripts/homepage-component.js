// This function is inserted into the exported home-page chunk by the build helper.
// r, l, V, A, _, R and I are the existing export's JSX/runtime/components.
function H(e) {
  const { dataByLocale, defaultLocale } = e;
  const locale = (0, V.D)(state => state.locale);
  const data = dataByLocale[locale] || dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
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
