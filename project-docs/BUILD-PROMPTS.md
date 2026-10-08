# 567811.com — Phase-wise Build Prompts

Copy each prompt into your AI builder in order. Each phase is self-contained and assumes the previous phase is merged.

**Global constraints (prepend to every prompt):**
> Static HTML/CSS/vanilla JS only, deployable on the GitHub Pages free plan (no server, no build step required to serve). Relative links only (site runs at `/567811-com/` until the custom domain is attached). Mobile-first, WCAG AA contrast, Lighthouse ≥ 90. Brand: "567811 — Count In. Dance On." Never use third-party trademarks as brand names. The site's contact address must never appear in HTML, JS strings, meta or README — forms post through FormSubmit using an address assembled at runtime from an obfuscated array. Every page carries a top bar: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership" linking to https://web.works/contact.

---

### Phase 1 — Foundation & design system
> Create the repo skeleton: `index.html`, `assets/css/style.css`, `assets/js/config.js`, `assets/js/app.js`, `.nojekyll`, `robots.txt`, `sitemap.xml`, `ads.txt`, `site.webmanifest`, SVG favicon, `404.html`. Design tokens on `:root` (stage-dark background, magenta + amber accents, Bricolage Grotesque headings, Inter body). Components: top partner bar, sticky header with mobile drawer, buttons, cards, badges, stat strip, accordion FAQ, modal, toast, form fields with validation states, ad slot, video card, footer with 4 columns + legal row. A Python generator (`_gen/build.py`) stamps the shared header/footer into every page so pages stay plain HTML.

### Phase 2 — Home page (conversion-first)
> Hero: "5, 6, 7, 8… hit the 1." with animated 8-count beat dots, primary CTA "Get matched with a choreographer — free", secondary "Open the Count-In Metronome". Then: 3-step how-it-works (Bark/Thumbtack style), 11-style grid, tools row, "Who we match" (wedding/sangeet, first dance, corporate/flash mob, private, kids, fitness), stats strip, featured video row, contest promo, guides row, pro CTA, FAQ (with FAQPage JSON-LD), newsletter, donation nudge. In-content ad slots after sections 2 and 5.

### Phase 3 — Lead-generation engine
> `get-matched.html`: 4-step form (Occasion → Style & group → Date/city/budget → Contact) with progress bar, per-step validation, trust strip ("free · no obligation · 3 quotes max · details shared only with matched pros"), consent checkbox, honeypot, UTM + referrer capture, success screen with next steps. Site-wide: sticky mobile CTA bar, exit-intent modal (once per session), inline mini-forms on guides and tools. `for-pros.html`: B2B page for studios/choreographers — plans (Free listing, Featured $29/mo, Exclusive leads pay-per-lead) and application form.

### Phase 4 — Interactive tools (traffic magnets)
> `tools/count-in.html`: Web Audio metronome 40–220 BPM, tap-tempo, voice/beep count-in ("5, 6, 7, 8"), 8-count visualiser, accent on 1 and 5, keyboard shortcuts. `tools/choreo-sheet.html`: editable 8-count grid (add/remove counts, notes per beat), saved to localStorage, print + copy-as-text. `tools/budget.html`: wedding/event dance budget estimator by region tier, performances, dancers, rehearsals → range + CTA to Get Matched with values prefilled. `tools/style-quiz.html`: 6-question quiz → one of 11 styles + tutorials + matched-teacher CTA.

### Phase 5 — Content & video
> `learn.html` (11 styles × level ladder), `videos.html` (YouTube embeds from `config.js`, lite-loading thumbnails; fallback to curated YouTube search cards), `guides/` with 6 long-form guides (8-count basics, wedding choreography cost, sangeet planner, first-dance guide, choosing a studio, styles explained) each with Article JSON-LD, ToC, inline lead form and ad slots.

### Phase 6 — Community, contests, auditions, careers
> `contests.html`: monthly "11-Count Challenge" — theme, timeline, prizes, judging criteria (%), rules, entry form (video link), sponsor slot. `auditions.html`: post-an-audition form + how listings work. `studios.html`: founding-listing programme + application. `careers.html`: open roles (choreographer-creators, video editor, community lead, sales) with application form.

### Phase 7 — Monetisation layer
> AdSense loader that activates only when `ADSENSE_CLIENT` is set; until then slots render house ads selling our own inventory. `advertise.html` with rate card (display, sponsored challenge, newsletter, featured listing) + media-kit request form. `donate.html` with tiers (Supporter $5, Crew $11, Studio $56, Headliner $567), goal bar, PayPal/Ko-fi/BMAC/Stripe/Patreon buttons from config, pledge form fallback; transparent use-of-funds (operations, promotion & marketing, hiring talent, contest prizes).

### Phase 8 — Trust, legal & SEO
> `about.html`, `the-567811-story.html` (number meaning across cultures), `contact.html` (form only), `legal.html` (trademark/copyright disclosure: 567811 used as a descriptive numeral; no affiliation with any business using "5678"; third-party marks belong to owners; DMCA process), `privacy.html` (forms, cookies, AdSense, YouTube), `terms.html`. Open Graph + Twitter cards, canonical, Organization + WebSite JSON-LD, sitemap.

### Phase 9 — Deploy
> Push to `webworksa1/567811-com` on `main` and `gh-pages`. Enable Pages (branch deploy, root). Activate FormSubmit with the first test submission. Later: add `CNAME` = `567811.com`, A records 185.199.108–111.153, `www` CNAME → `webworksa1.github.io`, enforce HTTPS, submit sitemap in Search Console, apply for AdSense.

### Phase 10 — Growth (post-launch)
> Launch YouTube channel "567811" (count-in tutorials, challenge recaps) and paste video IDs into config. Programmatic city pages ("wedding choreographer in {city}") for top 50 cities in IN/US/UK/CA/AE. Lead-buyer CRM sheet. A/B test the hero CTA. Add Supabase later for real listings & logins.
