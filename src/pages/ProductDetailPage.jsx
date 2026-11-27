import { use } from 'react'
import { Check, Cloud, MessageCircle, Plug, Server, Tag } from 'lucide-react'
import Breadcrumbs from '../components/detail/Breadcrumbs.jsx'
import CardGrid from '../components/detail/CardGrid.jsx'
import DetailSection from '../components/detail/DetailSection.jsx'
import HeroHeading from '../components/detail/HeroHeading.jsx'
import RelatedGrid from '../components/detail/RelatedGrid.jsx'
import ProductFeatures from '../components/product/ProductFeatures.jsx'
import ProductPreview from '../components/product/ProductPreview.jsx'
import CTABanner from '../components/sections/CTABanner.jsx'
import FAQAccordion from '../components/sections/FAQAccordion.jsx'
import ProcessTimeline from '../components/sections/ProcessTimeline.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { useConsultation } from '../context/ConsultationContext.jsx'
import { Stagger, StaggerItem } from '../components/ui/MotionWrapper.jsx'
import SectionReveal from '../components/ui/SectionReveal.jsx'
import { enquiryLabel } from '../data/companyData.js'
import { productBySlug } from '../data/productCatalog.js'
import { loadProductGroup } from '../data/productsData.js'
import { mergeContent } from '../lib/contentGroups.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { serviceNode } from '../seo/head.js'
import NotFoundPage from './NotFoundPage.jsx'
import InteractiveCard from '../components/ui/InteractiveCard.jsx'

const backdrops = {
  ops: 'bg-grid-lines bg-grid opacity-70 [mask-image:linear-gradient(#000_40%,transparent)]',
  edu: 'bg-dots [background-size:22px_22px] [mask-image:linear-gradient(#000_40%,transparent)]',
  care: 'bg-gradient-to-br from-subtle via-transparent to-transparent',
  portal: 'bg-grid-lines bg-grid opacity-60',
}

const productCrumbs = (product) => [{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: product.title }]

function ProductHero({ product }) {
  const { openConsultation } = useConsultation()
  const { hero, theme: variant } = product
  const discuss = () => openConsultation({ topic: product.title, context: `Product page: ${product.title}` })

  return (
    // The portal variant is a dark band in both themes; the nested `dark` class switches its children.
    <div className={variant === 'portal' ? 'dark' : undefined}>
      <section className={`relative isolate overflow-hidden ${variant === 'portal' ? 'border-b border-edge bg-subtle text-body' : ''}`}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className={`absolute inset-0 ${backdrops[variant]}`} />
          <div className="absolute -top-32 left-[30%] h-80 w-[34rem] max-w-full rounded-full accent-glow blur-[120px]" />
        </div>
        <div className="container-page pb-20 pt-10 lg:pb-24">
          <Breadcrumbs items={productCrumbs(product)} />
          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
            <Stagger immediate>
              <StaggerItem className="flex flex-wrap gap-2">
                <Badge tone="brand">{hero.eyebrow}</Badge>
                <Badge>{hero.crumb}</Badge>
              </StaggerItem>
              <StaggerItem className="mt-6"><HeroHeading segments={hero.heading} /></StaggerItem>
              <StaggerItem as="p" className="mt-6 text-pretty text-lg leading-8">{hero.description}</StaggerItem>
              <StaggerItem className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" arrow onClick={discuss}>{enquiryLabel}</Button>
                <Button size="lg" variant="secondary" href={hero.whatsapp}>
                  <MessageCircle aria-hidden="true" className="h-4 w-4" /> {hero.whatsappLabel}
                </Button>
              </StaggerItem>
              <StaggerItem as="ul" className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                {hero.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </StaggerItem>
            </Stagger>
            <ProductPreview variant={variant} data={product.preview} />
          </div>
        </div>
      </section>
    </div>
  )
}

const deploymentIcons = [Cloud, Server, Tag]

function ProductContent({ product }) {
  // Pages that sell development work are described as services. Software pages get no SoftwareApplication
  // markup: Google needs a published price and genuine ratings for it, and there are none to publish.
  const nodes = product.slug.endsWith('-development')
    ? [serviceNode({ path: product.path, name: product.hero.heading.map((segment) => segment.text).join(' '), serviceType: product.title, description: product.meta.description })]
    : []
  usePageMeta({
    title: product.meta.title, description: product.meta.description, path: product.path, exact: true,
    crumbs: productCrumbs(product), faq: product.faq.items, nodes,
  })
  const { features, modules, audience, deployment, integrations, rollout, faq, related, cta } = product

  return (
    <>
      <ProductHero product={product} />
      <DetailSection id="features" eyebrow={features.kicker} title={features.title} description={features.description} alt>
        <ProductFeatures variant={product.theme} items={features.items} />
      </DetailSection>
      <DetailSection id="modules" eyebrow={modules.kicker} title={modules.title} description={modules.description}>
        <CardGrid items={modules.items} />
      </DetailSection>
      <DetailSection id="industries" eyebrow={audience.kicker} title={audience.title} description={audience.description} alt>
        <CardGrid items={audience.items} columns="sm:grid-cols-2" horizontal />
      </DetailSection>

      <DetailSection id="deployment" eyebrow={deployment.kicker} title={deployment.title} description={deployment.description}>
        <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
          {deployment.items.map((item, index) => {
            const Icon = deploymentIcons[index % deploymentIcons.length]
            return (
              <StaggerItem key={item.title}>
                <InteractiveCard className="h-full p-6">
                  <span className="icon-tile"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                  <h3 className="mt-5 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6">{item.text}</p>
                </InteractiveCard>
              </StaggerItem>
            )
          })}
        </Stagger>
        <SectionReveal as="ul" className="mt-4 grid gap-3 rounded-card border border-edge bg-subtle p-5 text-sm font-medium sm:grid-cols-2 lg:grid-cols-4">
          {deployment.safeguards.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-600 dark:text-primary" />
              {item}
            </li>
          ))}
        </SectionReveal>
      </DetailSection>

      <DetailSection id="integrations" eyebrow={integrations.kicker} title={integrations.title} description={integrations.description} alt>
        <Stagger as="ul" className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {integrations.items.map((item) => (
            <StaggerItem as="li" key={item}>
              <InteractiveCard as="span" className="flex items-center gap-2.5 px-5 py-3 text-sm font-semibold text-heading">
                <Plug aria-hidden="true" className="h-4 w-4 text-primary" />
                {item}
              </InteractiveCard>
            </StaggerItem>
          ))}
        </Stagger>
      </DetailSection>

      <ProcessTimeline id="rollout" eyebrow={rollout.kicker} title={rollout.title} description={rollout.description} steps={rollout.steps} />
      <FAQAccordion items={faq.items} title={faq.title} description={faq.description || undefined} />
      <RelatedGrid eyebrow={related.kicker} title={related.title} description={related.description} items={related.items} allLink={{ label: 'View all products', to: '/products' }} />
      <CTABanner title={cta.title} text={cta.text} whatsapp={cta.whatsapp} topic={product.title} />
    </>
  )
}

export default function ProductDetailPage({ slug }) {
  const group = use(loadProductGroup(productBySlug[slug].theme))
  const product = mergeContent(productBySlug, group, slug)
  return product ? <ProductContent product={product} /> : <NotFoundPage />
}
