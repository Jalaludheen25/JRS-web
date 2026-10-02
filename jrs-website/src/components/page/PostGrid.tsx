import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, postsSorted } from "@/lib/pages";

type Post = ReturnType<typeof postsSorted>[number];

const fitClass = (fit: "cover" | "contain") => (fit === "contain" ? "object-contain mix-blend-multiply" : "object-cover");

/** Insights listing: lead story large, the rest as an editorial grid. */
export function PostGrid({ posts, leadLarge = true }: { posts: Post[]; leadLarge?: boolean }) {
  const [first, ...rest] = leadLarge ? posts : [undefined, ...posts];
  return (
    <div className="space-y-px">
      {first && (
        <Link href={`/${first.slug}/`} className="group relative grid gap-8 bg-white p-6 transition-colors hover:bg-plate lg:grid-cols-12 lg:items-center lg:p-10">
          <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-(--ease-expo) group-hover:scale-x-100" />
          <div className="relative aspect-[16/10] overflow-hidden bg-white lg:col-span-7">
            {first.content.featured && (
              <Image data-img-role="thumb" src={first.content.featured.src} alt={first.content.featured.alt} fill sizes="(min-width:1024px) 55vw, 100vw" className={`transition-transform duration-[1.2s] group-hover:scale-[1.04] ${fitClass(first.content.featured.fit)}`} />
            )}
          </div>
          <div className="lg:col-span-5">
            <Meta post={first} />
            <h2 className="heading mt-4 text-[clamp(1.75rem,3vw,2.75rem)] text-abyss">{first.content.h1}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-graphite/70">{first.description}</p>
            <span className="label mt-8 inline-flex items-center gap-2 text-accent-ink">
              Read article <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
            </span>
          </div>
        </Link>
      )}
      <ul className="grid gap-px bg-graphite/12 sm:grid-cols-2 lg:grid-cols-3">
        {rest.filter(Boolean).map((p) => (
          <li key={p!.slug} className="bg-white">
            <Link href={`/${p!.slug}/`} className="group relative flex h-full flex-col p-6 transition-colors hover:bg-plate">
              <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-(--ease-expo) group-hover:scale-x-100" />
              <div className="relative aspect-[16/10] overflow-hidden bg-white">
                {p!.content.featured && (
                  <Image data-img-role="thumb" src={p!.content.featured.src} alt={p!.content.featured.alt} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className={`transition-transform duration-[1.2s] group-hover:scale-[1.05] ${fitClass(p!.content.featured.fit)}`} />
                )}
              </div>
              <Meta post={p!} />
              <h2 className="heading mt-3 text-[clamp(1.25rem,1.8vw,1.6rem)] text-abyss">{p!.content.h1}</h2>
              <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-graphite/65">{p!.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <p className="label mt-5 flex flex-wrap gap-2 text-steel-500">
      {post.content.date && <span>{post.content.date}</span>}
      {post.category && (
        <>
          <span aria-hidden>·</span>
          <span className="text-accent-ink">{categories[post.category].label}</span>
        </>
      )}
    </p>
  );
}

export function CategoryNav({ active }: { active?: string }) {
  const items = [{ href: "/blogs/", label: "All insights", key: undefined as string | undefined }, ...Object.entries(categories).map(([k, v]) => ({ href: `/category/${k}/`, label: v.label, key: k }))];
  return (
    <nav aria-label="Insight categories">
      <ul className="flex flex-wrap gap-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              aria-current={it.key === active ? "page" : undefined}
              className={`label inline-flex h-10 items-center rounded-full border px-4 transition-colors ${
                it.key === active ? "border-accent bg-accent font-semibold text-abyss" : "border-graphite/20 text-graphite/70 hover:border-abyss hover:text-abyss"
              }`}
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
