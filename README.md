# Novix Softwares website


Rebranded on 26 Nov 2026: Novix Softwares, novixsoftwares.com, Nova Square, Greater Noida.

React, React Router, Tailwind CSS 3, Framer Motion and Lucide, built with Vite.

```bash
npm install
npm run dev       # local development
npm run build     # app build, one prerendered HTML file per route, sitemap/robots/redirects, then SEO checks (noindex unless a release)
npm test          # SEO, release-gate, enquiry form, mascot (incl. the robot's reactions) and testimonial tests
npm run preview   # quick look only: it does not reproduce Netlify's 404s or redirects
npm run test:mascot   # Node's test runner: robot arrival rules and where it may walk, pointer-follow math, testimonial filter
```

GitHub runs `npm test` and `npm run build` on every push to `main` and on pull requests (`.github/workflows/ci.yml`).

## Deploy to Netlify

Follow **`NETLIFY-SEO-LAUNCH.md`**. It lists the build settings, environment variables, dashboard steps, deploy checks and open launch blockers. In short:

- Production builds fail unless `SITE_URL` holds the confirmed domain. All other builds are `noindex`.
- **Enquiries go to Netlify Forms** (form name `enquiry`). `public/__forms.html` declares the form so Netlify finds it when it deploys, and `lib/submitLead.js` sends to it. Fields: `email, message, name, phone, service, topic, context, page`, plus the hidden spam trap `bot-field`. Only `email` and `message` are required, so the others can arrive empty. **A new field must be added to both files** (Netlify silently drops undeclared fields; the build fails if they differ). The form says "received" only when Netlify accepts it. On `npm run dev` or any other plain server it says "not sent", because only Netlify can receive it.

## How prerendering and metadata work

`scripts/prerender.mjs` renders every route with `src/entry-server.jsx` and writes flat files (`dist/about.html`), plus `404.html`, `sitemap.xml`, `robots.txt`, `_redirects` and, for non-release builds, `_headers`. `scripts/verify-dist.mjs` then fails the build on duplicate or missing titles, canonicals or headings, wrong robots tags, broken or orphaned internal links, a wrong sitemap or invalid structured data.

Each page passes its title, description, breadcrumbs and FAQs to `usePageMeta`. `src/seo/head.js` builds the canonical URL, robots tag, social tags and JSON-LD from them, for both the prerendered HTML and in-app navigation. A new page needs no separate SEO entry. The sitemap lists every route that is not marked `noindex`.

The origin is defined once in `src/data/siteOrigin.js`; `scripts/site-env.mjs` decides whether a build may be indexed.
Code that runs during rendering must not read `window`, `document` or `localStorage`; use an effect.

## Colour and motion

Follows the 26 Nov 2026 colour and motion brief.

- **Colours** are CSS variables in `src/index.css`: *Warm Ivory + Deep Teal* (light) and *Ink + Mint* (dark). Use the Tailwind names `page, surface, subtle, heading, body, edge, primary, on-primary, tint`; they switch with the theme, so no `dark:` colour variants are needed. `subtle`, `tint`, the light `edge` and the hover shades are derived (the brief did not specify them). If you change `--page`, also change the two `theme-color` values in `index.html` and `ThemeContext.jsx`.
- `InteractiveCard`: 3px lift, brighter border and a 4px arrow shift (`.nudge`) over 200ms, for hover and keyboard focus.
- `SectionReveal` / `Stagger`: a 10px, 400ms fade-up, once. **Nothing is hidden in the HTML** (`hooks/useReveal.js`): after the app loads, only blocks below the screen wait for scrolling. Without JavaScript or `IntersectionObserver`, with reduced motion, or if the observer never answers, everything is simply visible. CSS: `[data-reveal-state]`.
- There are no looping background animations.

## Header, footer, Home and About (27 Nov 2026 redesign)

- **Header:** the menu button appears **only on phones (under 640px)**. Everything wider shows the links across the top: on their own row up to 1023px, on one row from 1024px. Services and Products are links to their index pages with separate dropdown buttons (click or keyboard; Escape or a click elsewhere closes them). If you add header items, check 640px.
- **AI tab:** the first header link, with a "Hot" badge (`badge` in `primaryNav`, `data/navigation.js`; delete it to drop the badge). Its menu is `aiMenu`, which also decides which service pages are highlighted under AI instead of Services (`lib/navState.js`). The menu and the phone drawer link to the film.
- **Footer:** from 640px each group (Company, Services, Products, Contact) is one row with its links across; on phones they are vertical lists. Keep the character's CC BY credit.
- **Breakpoints:** where a layout must respect large browser text, use the plugin variants `fit-xs` (20rem), `fit-sm` (22.5rem), `fit-md` (40rem) and `wide` (64rem) from `tailwind.config.js`. **Never add rem sizes to `screens` or write `min-[…rem]` classes**: Tailwind then silently drops every `min-*` and `max-*` class (it only prints a warning during the build). Tailwind writes plugin variants before `sm:`/`lg:`, so don't set the same property with both on one element. After changing `tailwind.config.js`, restart `npm run dev`.
- **Home:** hero with real portfolio screenshots (WebP copies in `public/portfolio/thumbs/`) and a trust strip, four service cards, two featured projects (`selectedWork` in `homeData.js`; describe only what is visible on the live site), three ready-made products, the four-stage process (`processData.js`, shared with About and `/services`), four FAQs and the closing call to action. Industries and technology moved to `/services`; articles are on `/blog`.
- **About:** introduction with the new headline, "Our approach", "Who you will talk to", "Working with us", then the same closing call to action as Home.
- **Enquiries:** every button that opens the form says **"Discuss your project"** and the form's button says **"Send enquiry"** (`companyData.js`). Required: email and project summary. Success shows only when Netlify accepts it; otherwise the visitor keeps what they typed and is offered email or WhatsApp. `context` tells you which button was used. On service pages with their own form, the hero button scrolls to it.
- **About illustration** (`about/SoftwareBuildIllustration`) plays once for 3 seconds when in view; its captions are the three principles.
- **Contact:** `contact/ContactIntro`, `ContactDetails`, `ContactMethodRow`. The details panel is rendered twice and shown once, so reading and keyboard order match the layout. Edit it in one place.
- `PageHero compact` trims bottom padding; `DetailSection` accepts `className`.
- **Brand:** `brand/BrandMark` (geometric N) plus the "Novix Softwares" wordmark, used by `layout/Logo`. The favicons, `uploads/logo.png` and the social share image **still show the earlier NS lettering**.

## Video on the AI pages

- `media/FeatureVideo` appears under the introduction of **AI website integration** and **AI & machine learning**, from the `video` object on those two entries in `data/services/ai.js`. Files are in `public/videos/`: the film (`ai-automation.mp4`, 1280×548, with sound), its poster (the **first frame**, so playback starts without a jump) and the small menu picture. To replace the film, change all three.
- Nothing downloads until it is near the screen. It plays muted while mostly in view, pauses when scrolled away or in another tab, and stays paused if the visitor pauses it. Unmute, full screen, a "Discuss your project" button at the end, and a written "What happens in the video". With reduced motion or data saving it waits for Play; without JavaScript the browser's own controls work.
- If the film has speech, add captions: it has none yet.

## Mascots

Both are decorative, with no sound, speech or chat; their artwork is hidden from screen readers. `components/mascot/MascotProvider.jsx` holds their shared state. The robot starts nothing new while the About character is following the pointer.

**Site robot** (original SVG, `RobotArt.jsx`). These rules were changed on request on 26 and 27 Nov 2026 and replace the original brief's homepage-only, "once for 7 seconds" robot.
- On **every page**. It arrives about 1.5 seconds after the website loads and stays, across pages, **until it is clicked**. There is no close button: the robot is the button ("Discuss your project"). Clicked, it waves goodbye, drops off the screen, and then **the enquiry popup opens** (`context: "Robot button"`, set in `ROBOT_ENQUIRY` in `MascotProvider.jsx`). It stays away while the website stays open. **Refreshing brings it back** (nothing is saved in the browser).
- **Left or right:** it lives in a bottom corner, the left one on arrival. Peekaboos move it between them, and if something covers its corner it moves to the other corner when that one is free. Moving between pages keeps its side; a refresh starts on the left again.
- **Peekaboo** (requested 27 Nov 2026): **once as it arrives** it walks off the left edge, leans out of the bottom-right corner with its hands over its eyes, says "boo!" and walks in on the right. After that, **at random times** (12–35s apart, `PEEK_MS`; usually from the other side, `SWITCH_CHANCE`) from either corner, including while it is hidden. The corner part lasts about 2.5s and may overlap content. A random one makes way if the visitor scrolls or clicks into a form, and none starts while it is due a nap or asleep, while a video is playing, or while something has its attention. None with reduced motion.
- It moves about **when there is room**: it walks along the bottom of the window where nothing is in the way, or flies up an empty column such as the side margin. In between it waves, looks around, blinks, tilts, hops, and, where there is room, dances, jumps and flips.
- Apart from peekaboos, it **never stays on top of content**. If something comes under it, it slides below the window and comes back somewhere clear (its corner, the other corner, then anywhere along the bottom), or waits until there is room (on scroll, only when it is not in the side margin). Hidden, it is also skipped by the keyboard. This means that under 1364px wide it is sometimes out of view.
- **Reactions** (rules in `lib/mascot/reactions.js`, only while it is in view and no menu or popup is open, never with reduced motion):
  - **Nap:** after 20–22s with no mouse, keyboard or scrolling it yawns and falls asleep (asleep within 20–30s) with "z z z". The mouse or a key wakes it with a startled blink; scrolling wakes it quietly. Its breathing stops after about 30s, so nothing keeps animating.
  - **Dizzy:** circle the pointer around it quickly, twice (it stops to watch), and its eyes turn into spirals. It then needs 8s before it can be dizzy again.
  - **Welcome back:** returning to the tab after 3s or more away gets a happy wave.
  - **Secret dance:** typing "hello" anywhere outside a form. A smaller version where there is little room.
- It stops while pointed at or focused. It keeps still while a form field is in use, a menu or dialog is open or the tab is hidden, and ducks off screen while the visitor types in a form it covers. Its eyes follow the pointer. Only the drawing takes clicks. Keyboard: it is the first stop after "Skip to content"; Enter or Space does the same as a click.
- Desktop only: at least 1024px wide, with a mouse or trackpad. With reduced motion it stands still (still moving out of the way of content), and a click removes it and opens the popup at once.
- 104×129px from 1440px wide, where it fits in the side margin; 76×94px hugging the edge from 1364 to 1439px (it still fits the margin); 84×104px on narrower windows. Menus and the quote dialog open above it; **anything new that covers the page should call `useMascotBlocker(id, isOpen)`**.
- "Clear space" means no text, controls, pictures or boxed panels (`lib/mascot/space.js`, which counts `.card`, `.rounded-card` and `.rounded-panel`, so give new boxed panels one of these classes).
- Code: arrival rules in `lib/mascot/robotController.js` (`ROBOT`); movement and routine in `components/mascot/robotLife.js` (`TRICKS`, `SPEED`, `PAUSE_MS`); reaction and peekaboo timing in `lib/mascot/reactions.js` (peekaboo leg timings: `PEEKABOO` in `robotLife.js`); extra faces and the peekaboo hands in `RobotArt.jsx`; movements are drawn by the `.mascot-robot` rules in `index.css`.

**About character** (beside the About headline)
- "Interactive Character Follow" by [alinazari](https://rive.app/marketplace/28334-53514-interactive-character-follow/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credited in the footer's "Credits" and in `public/mascot/ATTRIBUTION.txt`. **Keep both credits while the character is used.**
- The green version was made from the **public runtime file, not the editable Rive source**. `design-source/mascot/README.md` lists every change and how to replace it with an editor export.
- A still poster is always there. The live version and its engine (served from this site, no CDN) load only near the section, at 768px or wider with a mouse or trackpad, and not with reduced motion. It follows the pointer only within a 220px square around it, then returns to neutral and pauses.
- Pointer range, easing and return time are in `lib/mascot/follow.js`.

## Testimonials

- `sections/TestimonialsSection` sits on the homepage between "How we work" and the FAQ. **It shows nothing, not even a heading, until there is an approved entry.**
- Add entries to `src/data/testimonialsData.js` (the fields are described there). Each needs `id`, `quote`, `clientName` and `approved: true`. **The file is public**, so add only words the client has approved for publication under Novix Softwares.
- Layout preview, development only: `npm run dev`, then open `/?testimonials-preview=1` (or `2`, `3`, `long`). The sample cards are labelled and are not part of a build.

## Status

| Phase | Scope | State |
|---|---|---|
| 1 | Theme, router (121 routes), navbar, footer, modal, homepage | Done |
| 2 | Full `servicesData.js` / `productsData.js`, service and product detail templates (91 pages) | Done |
| 3 | Services and products overviews, About, Portfolio, Blog, 2 articles, 19 archives, Contact, Legal | Done |

All 121 routes have real content. **Work through "Before launch" before going live.**

## Editing service and product pages

- Page text lives in `src/data/services/*.js` (by theme) and `src/data/products/*.js` (by variant), keyed by slug.
- `serviceCatalog.js` and `productCatalog.js` hold URL, menu title and theme. A new page needs an entry in both its catalog and its content file. The catalog `theme` must match the content file that holds the page.
- Content is downloaded one theme at a time (`servicesData.js`, `productsData.js`, `lib/contentGroups.js`).

## Editing other pages

| Page | Data file |
|---|---|
| Home | `homeData.js` (the four-stage process is in `processData.js`) |
| Services and Products overviews | `directoryData.js` |
| About, Portfolio, Contact | `aboutData.js` (stages in `processData.js`), `portfolioData.js`, `contactData.js` |
| Blog cards and archives | `blogData.js` |
| Article bodies | `articlesData.js` (also update `contentRoutes.js`) |
| Privacy policy, Terms | `legalData.js` (approved text only) |

A new article or tag also needs a route entry in `contentRoutes.js` or `archivesData.js`. The article date in `contentRoutes.js` is shown on the page and used in its structured data.

## Routing

Root-level URLs (for example `/cloud-migration-services`) are canonical.
`/services/:slug` and `/products/:slug` redirect to them (301 on Netlify).
`/enterprise-software-development` uses the service template although the Products menu links to it.

The route table and `preloadRoute` are in `src/routes/routeTable.js`, and the on-demand pages are declared in `src/routes/lazyPages.js`. **Export only the `App` component from `App.jsx`.** If it exports anything else, the dev server cannot update it in place, and saving content files reloads the whole page (which happened until 27 Nov 2026). Some saves still reload it (`index.html`, `main.jsx`, the Vite config and the files it imports); in development only, `src/lib/keepReadingPosition.js` then puts you back where you were reading.

## Before launch

- **Privacy policy and Terms: get them reviewed.** Only the company name, domain and contact details were changed. Confirm the registered legal name of Novix Softwares (the policy names it as "Data Fiduciary" and the Terms refer to its registered office), then set a new "Last updated" date. The text also describes the previous system: this app sets no session or anti-CSRF cookie (section 4), collects no company name or budget and has no newsletter or careers form (section 2). IP logging and the admin area (sections 2 and 7) depend on your backend. The browser requests fonts from Google and blog images from Unsplash.
- Confirm the opening hours (pages say 9:30 AM–7:30 PM; the previous site's markup said 09:00–19:00). Hours and address are left out of structured data until confirmed.
- After launch, submit the sitemap in Google Search Console and watch for crawl errors.
- Confirm both numbers (+91 8317020770, +91 9838485224) are on WhatsApp. The first is the default everywhere.
- Address: add the building or floor details and PIN code (`companyData.js`).
- **Netlify Forms:** before the first deploy, open **Forms** in Netlify and choose **Enable form detection** (if you turn it on later, deploy again). Then send one test enquiry from the live site, check it appears under Forms → `enquiry`, and add an email notification for new submissions. Netlify stores the enquiries, so the privacy policy should say so.
- Check the compliance, performance, guarantee, support and ranking claims carried over from the old website (the detailed list, `CONTENT_REVIEW.md`, is kept outside this repository).
- The testimonial section is hidden because there are no approved Novix Softwares testimonials yet. The nine from the previous brand are kept unedited outside this repository; none counts as a Novix endorsement without new approval. See "Testimonials" above.
- **The film on the AI pages: confirm you may use it** before publishing. Pirelli logos are clearly visible on the trackside, and its opening line ("Nobody asked me to make this ad") suggests it was made unprompted. That includes permission from anyone a realistic character is based on.
- Confirm Novix Softwares may present the 12 portfolio projects (screenshots included) as its own work.
- **Ready-made products:** confirm each product shown on Home (CRM, ERP, School management) is ready to offer. Product pages still say "Ask for a free demo with no obligation": keep it only if demos exist.
- **Portfolio text to fix:** Hamrogadi's description (vehicle rental and driver hire) does not match its live site (a car buying and selling marketplace). Karsar Spares' description mentions WhatsApp ordering, which was not found on its site.
- Confirm the commitments on Home and About match how you work: regular demos, agreed source-code handover and documentation, testing, code review, performance and security checks, a project lead as main contact, agreed support, and the fixed-price, dedicated-team and hourly options. Reply times, NDA signing and "free" consultation promises were removed from the enquiry flow; add them back only if you keep them.
- Service pages still carry their own claims (for example "NDA before discovery" and "Two-week sprints with demos"; Home says "regular demos").
- Add real founder or team names and photos to About if you want them (none were invented).
- Add real social profile URLs in `src/data/companyData.js`; the links stay hidden until then.

## Structure

```
src/
  context/      ThemeContext, ConsultationContext
  data/         navigation, homeData, processData, companyData, contentRoutes, archivesData, siteRoutes,
                directoryData, aboutData, portfolioData, contactData, blogData, articlesData, legalData,
                serviceCatalog, productCatalog, servicesData, productsData,
                services/ (7 files), products/ (4 files),
                testimonialsData, testimonials.sample (development only)
  hooks/        useDialog, useReveal, usePageMeta, useMediaQuery
  lib/          submitLead, focusMain, navState, lazyPage, keepReadingPosition (development only),
                mascot/ (robotController, space, follow, reactions, animationOwner)
  routes/       routeTable (pages and preloadRoute), lazyPages
  components/
    mascot/     MascotProvider, SiteRobot, robotLife, RobotArt, AboutCharacter, AboutCharacterRive
    media/      FeatureVideo
    ui/         MotionWrapper, SectionReveal, InteractiveCard, SectionHeader, Badge, HotBadge, Button, ThemeToggle, ContentIcon, RichText, PageHero
    layout/     SiteLayout, Navbar, MegaMenu, MobileDrawer, Footer, Logo, ConsultationModal
    forms/      LeadForm
    brand/      BrandMark
    about/      SoftwareBuildIllustration, AboutValues
    contact/    ContactIntro, ContactDetails, ContactMethodRow
    detail/     ServiceHero, serviceThemes, CardGrid, DetailSection, RelatedGrid, Breadcrumbs, HeroHeading
    product/    ProductPreview, ProductFeatures
    blog/       BlogListing, ArticleView, ArticleCard
    sections/   HeroSection, ServicesOverview, SelectedWork, ReadyMadeProducts, ProcessTimeline,
                TestimonialsSection, TestimonialCard, FAQAccordion, CTABanner, CompactProjectCTA
  pages/
public/mascot/  character file, still poster, attribution
public/videos/  the film on the AI pages, its poster and menu picture
public/portfolio/thumbs/  WebP copies of the screenshots used on Home
design-source/  mascot/ (unmodified original and change notes; not published)
tests/          robot controller, walking space, pointer follow, robot reactions, testimonial filter, SEO
```
