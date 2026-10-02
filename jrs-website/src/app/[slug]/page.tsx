import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page/PageHero";
import { ArticleBlocks, ContentBlocks } from "@/components/page/ContentBlocks";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { QuoteBand } from "@/components/page/QuoteBand";
import { JsonLd, TechnicalSpec } from "@/components/ui/primitives";
import { categories, getContent, getPage, pages, postImage, postsSorted, type PageEntry } from "@/lib/pages";
import { resolveLink, type LinkCard } from "@/lib/links";
import { products, referenceDisclaimer, services } from "@/lib/content";
import { absolute, orgId, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};
  const img = page.image ?? postImage(slug);
  return pageMetadata({ title: page.title, description: page.description, path: `/${slug}/`, image: img?.src });
}

const crumbParent: Record<PageEntry["kind"], { name: string; path: string }> = {
  product: { name: "Products", path: "/products/" },
  service: { name: "Services", path: "/services/" },
  industry: { name: "Industries", path: "/industries/" },
  brand: { name: "Brands", path: "/brands/" },
  post: { name: "Insights", path: "/blogs/" },
};

const eyebrow: Record<PageEntry["kind"], string> = {
  product: "Product — Engine spare parts",
  service: "Technical service — Abu Dhabi",
  industry: "Industry solutions",
  brand: "Engine spare parts — GCC supply",
  post: "Insights",
};

const links = (keys: string[] = []) => keys.map(resolveLink).filter(Boolean) as LinkCard[];

export default async function LegacyPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = getPage(slug);
  const content = getContent(slug);
  if (!page || !content) notFound();

  const crumbs = [crumbParent[page.kind], { name: page.label, path: `/${slug}/` }];

  if (page.kind === "post") return <Post page={page} content={content} crumbs={crumbs} />;

  const product = products.find((p) => p.href === `/${slug}/`);
  const service = services.find((s) => s.href === `/${slug}/`);
  const scene = page.kind === "service" || page.kind === "industry";
  const tone = scene ? "dark" : "light";

  return (
    <>
      <PageHero variant={scene ? "scene" : "plate"} eyebrow={eyebrow[page.kind]} title={content.h1} lead={content.lead} crumbs={crumbs} image={page.image} />

      {product && (
        <section className="border-y border-graphite/10 bg-white text-graphite">
          <div className="shell grid gap-6 py-10 lg:grid-cols-12">
            <p className="label text-steel-500 lg:col-span-3">At a glance</p>
            <TechnicalSpec
              dark={false}
              className="lg:col-span-8 lg:col-start-5"
              rows={[
                ["Range", product.short],
                ["Highlights", product.tags.join(" · ")],
                ["Availability", "Contact JRS for availability and specifications."],
              ]}
            />
          </div>
        </section>
      )}

      <section className={`section-y ${tone === "light" ? "bg-plate text-graphite" : "bg-abyss"}`}>
        <div className="shell">
          <ContentBlocks blocks={content.blocks} tone={tone} />
          {page.kind === "brand" && <p className="mt-16 max-w-3xl text-[13px] leading-relaxed text-graphite/55">{referenceDisclaimer}</p>}
        </div>
      </section>

      {page.kind === "industry" && <IndustryGrids slug={slug} />}
      {page.kind === "brand" && <BrandPosts page={page} />}
      {page.related && <RelatedLinks eyebrow="Related" title="Explore related solutions" items={links(page.related)} tone={tone === "light" ? "dark" : "light"} />}

      <QuoteBand subject={page.label.toLowerCase()} defaultTopic={product?.name ?? service?.title} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          // Products carry no public price, so Product markup would be an invalid rich-result item.
          "@type": page.kind === "service" ? "Service" : page.kind === "product" ? "WebPage" : "CollectionPage",
          name: content.h1,
          description: page.description,
          url: absolute(`/${slug}/`),
          ...(page.image && { image: absolute(page.image.src) }),
          ...(page.kind === "service" ? { provider: { "@id": orgId }, areaServed: "AE" } : { publisher: { "@id": orgId } }),
        }}
      />
    </>
  );
}

function IndustryGrids({ slug }: { slug: string }) {
  const powerGen = slug === "power-generation";
  const productKeys = products
    .filter((p) => powerGen || !["avr", "genset-controllers"].includes(p.slug))
    .map((p) => p.href.replace(/^\/|\/$/g, ""));
  const serviceKeys = powerGen
    ? ["engine-overhaul-service-in-abu-dhabi", "turbocharger-overhauls-in-abu-dhabi", "services/fuel-pump-overhaul", "services/electrical-instrumentation", "services/governors"]
    : ["engine-overhaul-service-in-abu-dhabi", "turbocharger-overhauls-in-abu-dhabi", "services/marine-fuel-pump-injector-service", "outboard-engine-repair-overhaul-in-abu-dhabi", "boats-maintenance-and-services", "services/reconditioning-engine-parts"];
  return (
    <>
      <RelatedLinks eyebrow="Products" title="Products for this industry" items={links(productKeys)} tone="light" />
      <RelatedLinks eyebrow="Services" title="Services for this industry" items={links(serviceKeys)} tone="dark" />
    </>
  );
}

function BrandPosts({ page }: { page: PageEntry }) {
  const key = page.label.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const posts = postsSorted().filter((p) => p.slug.includes(key));
  return <RelatedLinks eyebrow="Insights" title={`${page.label} spare parts across the GCC`} items={links(posts.map((p) => p.slug))} tone="dark" />;
}

function Post({ page, content, crumbs }: { page: PageEntry; content: NonNullable<ReturnType<typeof getContent>>; crumbs: { name: string; path: string }[] }) {
  const cat = page.category ? categories[page.category] : undefined;
  const more = postsSorted()
    .filter((p) => p.slug !== page.slug)
    .sort((a, b) => Number(b.category === page.category) - Number(a.category === page.category))
    .slice(0, 3)
    .map((p) => p.slug);
  const iso = content.date ? new Date(`${content.date} 12:00 UTC`).toISOString().slice(0, 10) : undefined;

  return (
    <>
      <PageHero
        variant="plate"
        eyebrow={eyebrow.post}
        title={content.h1}
        crumbs={crumbs}
        cta={false}
        meta={
          <p className="label mt-8 flex flex-wrap items-center gap-3 text-steel-500">
            {content.date && <time dateTime={iso}>{content.date}</time>}
            {cat && (
              <>
                <span aria-hidden>·</span>
                <Link href={`/category/${page.category}/`} className="link-underline text-marine">
                  {cat.label}
                </Link>
              </>
            )}
            <span aria-hidden>·</span>
            <span>JRS Mechanical Equipment</span>
          </p>
        }
      />
      <article className="bg-plate pb-[var(--section-y)] text-graphite">
        {content.featured && (
          <div className="shell">
            <div className="relative mx-auto aspect-[16/9] max-w-[1100px] overflow-hidden bg-white">
              <Image src={content.featured.src} alt={content.featured.alt} fill preload sizes="(min-width:1100px) 1100px, 100vw" className="object-contain p-6 mix-blend-multiply" />
            </div>
          </div>
        )}
        <div className="shell mt-16">
          <ArticleBlocks blocks={content.blocks} />
        </div>
      </article>
      {page.related && <RelatedLinks eyebrow="Related" title="Related products & services" items={links(page.related)} tone="dark" />}
      <RelatedLinks eyebrow="Insights" title="More from JRS" items={links(more)} tone="light" />
      <QuoteBand subject="these parts" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: content.h1,
          description: page.description,
          ...(iso && { datePublished: iso }),
          ...(content.featured && { image: absolute(content.featured.src) }),
          mainEntityOfPage: absolute(`/${page.slug}/`),
          author: { "@id": orgId },
          publisher: { "@id": orgId },
        }}
      />
    </>
  );
}
