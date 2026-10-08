# 567811.com — Count In. Dance On.

Dance tutorials (11 styles), free practice tools, a choreographer/studio **lead-generation** funnel, monthly contest, auditions board, donations and advertising — static HTML/CSS/JS on the **GitHub Pages free plan**.

Live: https://webworksa1.github.io/567811-com/

## Structure
```
index.html · get-matched.html (lead gen) · for-pros.html (B2B) · learn.html · videos.html
studios.html · auditions.html · contests.html · donate.html · advertise.html · careers.html
about.html · the-567811-story.html · contact.html · legal.html · privacy.html · terms.html · 404.html
tools/    count-in metronome · choreo sheet · budget estimator · style quiz
guides/   6 long-form guides
assets/js/config.js   ← the only file you edit (AdSense, YouTube, donations, GA4)
assets/js/app.js      UI, forms, ads, video, donations, lead modal
assets/js/tools.js    interactive tools
_layouts/default.html shared head, partner bar, header, footer, lead modal (Jekyll, built by GitHub Pages)
project-docs/         RESEARCH.md · BUILD-PROMPTS.md
```

## Go-live checklist
1. **Pages:** Settings → Pages → Deploy from a branch → `gh-pages` (or `main`) / root.
2. **Forms:** the first submission triggers a one-time FormSubmit activation email to the site inbox — click *Activate*. The address is never shown on the site (assembled at runtime from an obfuscated array in `config.js`).
3. **AdSense:** set `ADSENSE_CLIENT` (+ slot ids) in `config.js`; add your publisher line to `ads.txt`. Until then slots show house ads.
4. **YouTube / donations / GA4:** fill the matching keys in `config.js`.
5. **Custom domain:** add `CNAME` with `567811.com`; set `baseurl: ""` in `_config.yml`, update `canon` URLs in page front matter and the 404 page links to `/`; DNS A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `www` CNAME → `webworksa1.github.io`; enable *Enforce HTTPS*; update `robots.txt` sitemap URL.
6. Submit `sitemap.xml` in Google Search Console.

## Partnerships
Interested in this website / domain / sponsorship / advertising / partnership → https://web.works/contact

## Legal
“567811” is used as a descriptive numeral (the dance count-in “5, 6, 7, 8” + “1, 1”). No trademark is claimed in the numeral; no affiliation with any business using “5678” or similar marks. See `legal.html`.
