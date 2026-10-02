import { PageHero } from "@/components/page/PageHero";
import { CategoryNav, PostGrid } from "@/components/page/PostGrid";
import { QuoteBand } from "@/components/page/QuoteBand";
import { postsSorted } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blogs - JRS",
  description:
    "Insights from JRS Mechanical Equipment on marine engine spare parts, fuel injection and engine maintenance for Cummins, Wärtsilä and Yanmar engines across the UAE and GCC.",
  path: "/blogs/",
});

export default function BlogsPage() {
  return (
    <>
      <PageHero
        variant="plate"
        eyebrow="Insights"
        title="Blogs & insights"
        lead="Practical guidance on engine spare parts, fuel injection and maintenance for marine, industrial and power-generation operators across the UAE and GCC."
        crumbs={[{ name: "Insights", path: "/blogs/" }]}
        cta={false}
        meta={
          <div className="mt-10">
            <CategoryNav />
          </div>
        }
      />
      <section className="bg-plate pb-[var(--section-y)]">
        <div className="shell">
          <PostGrid posts={postsSorted()} />
        </div>
      </section>
      <QuoteBand subject="spare parts or a repair" />
    </>
  );
}
