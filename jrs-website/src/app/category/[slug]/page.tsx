import { notFound } from "next/navigation";
import { PageHero } from "@/components/page/PageHero";
import { CategoryNav, PostGrid } from "@/components/page/PostGrid";
import { QuoteBand } from "@/components/page/QuoteBand";
import { categories, postsSorted, type PostCategory } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const c = categories[slug as PostCategory];
  return c ? pageMetadata({ title: c.title, description: c.description, path: `/category/${slug}/` }) : {};
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const c = categories[slug as PostCategory];
  if (!c) notFound();
  const posts = postsSorted().filter((p) => p.category === slug);
  return (
    <>
      <PageHero
        variant="plate"
        eyebrow="Insights — Category"
        title={c.label}
        lead={c.description}
        crumbs={[{ name: "Insights", path: "/blogs/" }, { name: c.label, path: `/category/${slug}/` }]}
        cta={false}
        meta={
          <div className="mt-10">
            <CategoryNav active={slug} />
          </div>
        }
      />
      <section className="bg-plate pb-[var(--section-y)]">
        <div className="shell">
          <PostGrid posts={posts} leadLarge={posts.length > 3} />
        </div>
      </section>
      <QuoteBand subject={`${c.label.toLowerCase()} parts`} />
    </>
  );
}
