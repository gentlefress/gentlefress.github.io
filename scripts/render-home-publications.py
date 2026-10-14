"""Sync the homepage list from the publication route and framework manifest.

Run with Python 3 after editing publications/index.txt or sources.json.
This export has no original Next.js project; preserve its Flight text records.
"""
import hashlib
import json
import re
from html import escape
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
START = '<!-- homepage-publications:start -->'
END = '<!-- homepage-publications:end -->'
compact = lambda value: json.dumps(value, ensure_ascii=False, separators=(',', ':'))


def publication_data():
    text = (ROOT / 'publications/index.txt').read_text()
    row = next(line[2:] for line in text.splitlines() if line.startswith('9:['))
    return json.loads(row)[3]['dataByLocale']['en']['publications']


def external_url(value):
    assert urlsplit(value).scheme in ('http', 'https'), value
    return escape(value, quote=True)


def venue(paper):
    full = paper.get('journal') or paper.get('conference') or 'arXiv'
    if 'arxiv' in full.lower():
        return 'arXiv', full
    acronym = re.search(r'\(([^)]+)\)', full)
    return (acronym[1] if acronym else full), full


def render(papers, figures):
    years = sorted({paper['year'] for paper in papers}, reverse=True)
    links = ''.join(f'<a href="#publications-{year}">{year}</a>' for year in years)
    parts = [f'<div class="pub-heading"><h2 id="publications-heading">Publications</h2><nav class="pub-years" aria-label="Publication years">{links}</nav></div>',
             f'<p class="pub-intro">{len(papers)} papers · {min(years)}–{max(years)}. <span>Underlined authors: equal contribution.</span></p>']
    for year in years:
        parts.append(f'<section class="pub-year" id="publications-{year}" aria-labelledby="publications-year-{year}"><h3 class="pub-year-heading" id="publications-year-{year}">{year}</h3>')
        for paper in (p for p in papers if p['year'] == year):
            title = escape(paper['title'])
            paper_url = paper.get('paperUrl') or paper.get('url') or 'https://arxiv.org/abs/' + paper['arxivId']
            title_url = paper.get('homepage') or paper_url
            figure = figures[paper['id']]
            image_path = figure['image']
            assert image_path.startswith('/papers/frameworks/') and (ROOT / image_path[1:]).is_file(), image_path
            parts.append(f'<article class="pub-row" id="pub-{escape(paper["id"])}"><a class="pub-figure" href="{escape(image_path)}" target="_blank" rel="noopener noreferrer" aria-label="View framework figure: {title}"><img src="{escape(image_path)}" alt="Framework overview for {title}" loading="lazy" decoding="async" width="800" height="500"/></a><div class="pub-info"><h4 class="pub-title"><a href="{external_url(title_url)}" target="_blank" rel="noopener noreferrer">{title}</a></h4>')
            authors = []
            for author in paper['authors']:
                name = escape(author['name'])
                if author.get('isCoAuthor'):
                    name = f'<span class="pub-equal">{name}</span>'
                if author.get('isHighlighted'):
                    name = f'<strong class="pub-self">{name}</strong>'
                if author.get('isCorresponding'):
                    name += '<sup>†</sup>'
                authors.append(name)
            short_venue, full_venue = venue(paper)
            parts.append('<p class="pub-authors">' + ', '.join(authors) + '</p>')
            venue_label = paper.get('venueLabel') or f'{short_venue} {year}'
            parts.append(f'<p class="pub-venue" title="{escape(full_venue)}">{escape(venue_label)}</p>')
            if paper.get('description'):
                note = escape(paper['description'])
                if paper.get('descriptionBold'):
                    note = '<strong>' + note + '</strong>'
                parts.append('<p class="pub-note">' + note + '</p>')
            parts.append('<div class="pub-links">')
            resources = [('Paper', paper_url), ('Project', paper.get('homepage')), ('Code', paper.get('code'))]
            if paper.get('doi'):
                resources.append(('DOI', 'https://doi.org/' + paper['doi']))
            for label, url in resources:
                if url:
                    parts.append(f'<a href="{external_url(url)}" target="_blank" rel="noopener noreferrer">{label}</a>')
            if paper.get('bibtex'):
                parts.append('<details class="pub-citation"><summary>BibTeX</summary><pre>' + escape(paper['bibtex']) + '</pre></details>')
            parts.append('</div></div></article>')
        parts.append('</section>')
    return ''.join(parts)


def update_flight(text, markup):
    def visit(value):
        if isinstance(value, dict):
            if 'pagesToShow' in value and 'author' in value:
                value['publicationsHtml'] = markup
            for child in value.values():
                visit(child)
        elif isinstance(value, list):
            for child in value:
                visit(child)
    def row(match):
        try:
            value = json.loads(match[2])
        except json.JSONDecodeError:
            return match[0]
        visit(value)
        return match[1] + compact(value)
    return re.sub(r'(?m)^(\s*[0-9a-f]+:)([\[{].*)$', row, text)


def main():
    papers = publication_data()
    figures = json.loads((ROOT / 'papers/frameworks/sources.json').read_text())
    markup = render(papers, figures)
    path = ROOT / 'index.html'
    source = path.read_text()
    block = START + '<section id="publications" class="home-publications" aria-labelledby="publications-heading">' + markup + '</section>' + END
    assert source.count(START) == source.count(END) == 1
    source = re.sub(re.escape(START) + r'.*?' + re.escape(END), lambda _: block, source, flags=re.S)
    def inline(match):
        text = update_flight(json.loads(match[1]), markup)
        encoded = compact(text).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
        return '<script>self.__next_f.push([1,' + encoded + '])</script>'
    source = re.sub(r'<script>self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)</script>', inline, source)
    path.write_text(source)
    path = ROOT / 'index.txt'
    path.write_text(update_flight(path.read_text(), markup))

    # Keep asset filenames fresh when this stylesheet changes.
    old_css = ROOT / re.search(r'href="/(_next/static/css/[^"?]+\.css)"', source)[1]
    marker = '\n/* HOMEPAGE PUBLICATIONS */\n'
    css = old_css.read_text().split(marker)[0] + marker + (ROOT / 'assets/home-publications.css').read_text()
    new_css = old_css.with_name(hashlib.sha256(css.encode()).hexdigest()[:16] + '.css')
    new_css.write_text(css)
    if new_css != old_css:
        for path in [*ROOT.rglob('*.html'), *ROOT.rglob('*.txt')]:
            original = path.read_text()
            if old_css.name in original:
                path.write_text(original.replace(old_css.name, new_css.name))
        old_css.unlink()
    source = (ROOT / 'index.html').read_text()
    old_chunk = ROOT / re.search(r'src="/(_next/static/chunks/app/page-[^"?]+\.js)"', source)[1]
    javascript = old_chunk.read_text()
    start = javascript.index('function H(')
    end = javascript.index('}}},e=>', start) + 1
    component = 'function H(' + (ROOT / 'scripts/homepage-component.js').read_text().split('function H(', 1)[1].rstrip()
    javascript = javascript[:start] + component + javascript[end:]
    new_chunk = old_chunk.with_name('page-' + hashlib.sha256(javascript.encode()).hexdigest()[:16] + '.js')
    new_chunk.write_text(javascript)
    if new_chunk != old_chunk:
        for path in [*ROOT.rglob('*.html'), *ROOT.rglob('*.txt')]:
            original = path.read_text()
            if old_chunk.name in original:
                path.write_text(original.replace(old_chunk.name, new_chunk.name))
        old_chunk.unlink()
    print(f'Rendered {len(papers)} homepage publications and synchronized HTML, Flight data, and CSS.')


if __name__ == '__main__':
    main()
