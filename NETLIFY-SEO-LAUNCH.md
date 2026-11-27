# Netlify SEO launch guide

Nothing has been deployed, published or changed in DNS.

## 1. Resolve first

- [x] **Graphhene:** the owner states it is a friend's site that stays live. Skip section 7 and add no redirects. Keep rewriting shared text.
- [x] **Portfolio and products:** the owner states they are their own. Blog and remaining pages are rewritten.
- [ ] **Legal pages:** privacy policy and terms still match the friend's site; get them reviewed.
- [ ] **Enquiry form (Netlify Forms, chosen 27 Nov 2026 instead of your own backend):** turn on form detection (Netlify → Forms → Enable form detection) before deploying. After deploying, send a test enquiry from the live site, check it appears under Forms, and add an email notification.
- [ ] **Domain and brand:** confirm `https://novixsoftwares.com` without `www`, and the spelling "Novix". The README names this domain, but ownership is not proven by the project. It currently shows a Hostinger parking page.
- [ ] **Facts:** answer the open content questions (`SEO-COPY-CHANGES.md`, kept outside this repository), including legal review of the privacy policy and terms.

## 2. Build settings

| Setting | Value | Source |
|---|---|---|
| Build command | `npm run build` | `netlify.toml` |
| Publish directory | `dist` | `netlify.toml` |
| Node | 24 | `.nvmrc` (`package.json` requires 22.12 or later) |
| Package manager | npm, using `package-lock.json` | No dependencies were added |

No functions, adapter, SPA rewrite or prerender extension is needed. Every route is prerendered at build time, so [Netlify's Prerender extension](https://docs.netlify.com/build/post-processing/prerendering/) would add function usage for no benefit. Do not enable it or the deprecated legacy prerendering. **Do not add `/* /index.html 200`:** it would turn every invented URL into a 200.

## 3. Environment variables

| Variable | Value | Scope and notes |
|---|---|---|
| `SITE_URL` | The confirmed origin, e.g. `https://novixsoftwares.com` | Required in Production. Setting it is your confirmation. HTTPS, no path |
| `REDIRECT_ALIASES` | `true` | Add only after step 5 works |

Netlify sets `CONTEXT` and `SITE_NAME` itself. Do not set `RELEASE` in Netlify.

| Build | Indexable | Behaviour |
|---|---|---|
| `CONTEXT=production` | Yes | Fails without a valid `SITE_URL`. |
| Deploy Preview, branch deploy, local | No | `noindex` meta tags and `X-Robots-Tag: noindex, nofollow` through `dist/_headers`. `robots.txt` stays open so crawlers can see it |
| `SITE_URL=… npm run build:release` | Yes | To check production output locally |

A plain local build is `noindex`: **never drag a local `dist/` onto the production site.**

**Enquiry form:** Netlify Forms collects it (form name `enquiry`, declared in `public/__forms.html`). It needs no settings or functions beyond turning on form detection. Netlify filters spam, and the form has a hidden spam trap. The old `/api/submit_form.php` is not used.

## 4. Preview and check

1. Connect the repository (this folder is not yet a Git repository) or run `npx netlify-cli deploy` for a draft.
2. Run `npm run check:deploy -- https://<preview-url>`. It checks all 121 routes, canonicals, `noindex`, unknown paths returning 404, 91 path redirects and key files.
3. **Pretty URLs:** every route must return **200 without a trailing slash**. Netlify's [redirect documentation](https://docs.netlify.com/manage/routing/redirects/redirect-options/) says Pretty URLs "forwards" `/about` to `/about/` without giving a status. The local emulator returned 200 for both. If the preview redirects `/about` or `/blog`, turn Pretty URLs off (Project configuration → Developer settings → Post processing) and run the check again.
4. Check response headers on a Deploy Preview **and** a branch deploy with `curl -I`. Netlify [adds `noindex` to Deploy Previews, but not to the latest branch deploy](https://docs.netlify.com/deploy/deploy-overview/); this build adds its own. If staging must be private, use password protection. `noindex` and `robots.txt` are not access control.
5. Run the [Rich Results Test](https://search.google.com/test/rich-results) and [Schema.org Validator](https://validator.schema.org/) on home, a service, a product and an article. The Rich Results Test code input works if the preview cannot be fetched.
6. Test both themes on a real phone and desktop, keyboard navigation, reduced motion, and one real form submission.

## 5. Domain and HTTPS (you, in the dashboards)

1. Add the domain in Netlify and make the apex the **primary domain**, with `www` as an alias.
2. Update DNS as Netlify instructs. **Keep the existing MX records** (they point to Hostinger mail) and any SPF, DKIM and DMARC records. Confirm `info@novixsoftwares.com` receives mail afterwards.
3. Wait for the certificate, then turn on forced HTTPS if it is not already on.
4. Remove the parking page by pointing DNS away from it.

## 6. Production deploy and alias redirects

1. With `SITE_URL` set and form detection on, deploy production.
2. Once the domain works over HTTPS, add `REDIRECT_ALIASES=true` and redeploy. This writes path-preserving 301 rules from `www` (or the apex, if `www` is primary) and from `<site-name>.netlify.app`, for both HTTP and HTTPS. They name exact hosts, so previews and branch deploys are unaffected. Enabling this before the domain works would redirect the only reachable copy.
3. Run:

   ```bash
   SITE_URL=https://novixsoftwares.com NETLIFY_HOST=<site-name>.netlify.app \
     npm run check:deploy -- https://novixsoftwares.com --production
   ```

4. Confirm that pages send **no** `X-Robots-Tag: noindex`, `/sitemap.xml` is XML with 102 URLs on the final origin, `/robots.txt` allows crawling, and a made-up URL returns 404.

## 7. Only if you own Graphhene and are renaming it

**Skip this section if you do not own it.** No migration rules are in this repository.

- **Where redirects run:** on whatever serves `graphhenesoftwares.com`. Deploying the new site cannot redirect visitors who still reach the old host. If the old domain is instead moved to the same Netlify project, add it as a domain alias and write domain-level rules.
- **Rule:** after the new production site is verified, 301 each old URL to the **same path** on the new origin, including `www` and HTTP. All 102 old sitemap paths exist in this build.
- **Beyond the sitemap:** compare Search Console pages, server logs and linked URLs, including old archives, files and parameter URLs. Map each to its closest equivalent. Let removed content with no equivalent return 404 or 410; do not send it all to the homepage.
- **Search Console:** verify both domains, submit the new sitemap and use Change of Address.
- Keep the redirects for as long as possible, at least a year, and keep the old domain registered. Follow [Google's site move guide](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) and monitor both properties.

## 8. After launch

- [ ] Confirm domain, HTTPS, redirects, real 404s, indexable headers and sitemap URLs.
- [ ] Verify a **Domain property** in [Google Search Console](https://search.google.com/search-console) with the DNS record Google gives you. Submit `/sitemap.xml`. Add Bing Webmaster Tools if wanted.
- [ ] Use URL Inspection on home and the priority pages. After crawling, review Page indexing and compare your canonical with Google's.
- [ ] **Baseline:** record weekly organic clicks, impressions and queries, plus enquiries actually received by form, email, phone and WhatsApp.
- [ ] **Analytics:** none is installed. If you add it, supply your own ID, count a form lead only when `submitLead` returns `'sent'`, count email, phone and WhatsApp clicks separately as clicks (not leads), never send names, numbers, emails or messages, and update the privacy policy and consent handling.
- [ ] **Core Web Vitals:** check field data in Search Console once enough exists. Targets at the 75th percentile are LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1. Until then, lab results do not show a pass.
- [ ] **Google Business Profile:** only if the business meets [Google's eligibility rules](https://support.google.com/business/answer/7039811), which require in-person contact with customers during stated hours. An online-only business does not qualify. Use the exact real name, address and hours.

## 9. Ongoing plan

| When | Do |
|---|---|
| Weeks 1–4 | Watch indexing and enquiries; fix crawl errors; start rewriting priority pages from your own experience |
| Monthly | Publish one useful article from the six briefs, reviewed by someone who has done the work; add real project evidence as clients approve it |
| Quarterly | Review queries per page, then improve or merge overlapping and unindexed pages with 301s; recheck claims, prices and details |
| As earned | List accurate profiles in relevant directories and ask real clients or partners for mentions. Do not buy links |

No outreach has been sent. Results take time and none are guaranteed. SEO needs continuing upkeep.
