import Link from "next/link";
import { JsonLd } from "@/components/ui/primitives";
import { breadcrumbSchema } from "@/lib/seo";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className={`label flex flex-wrap items-center gap-x-2 gap-y-1 ${tone === "dark" ? "text-white/60" : "text-steel-500"}`}>
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {i < all.length - 1 ? (
                <Link href={c.path} className={`link-underline ${tone === "dark" ? "hover:text-white" : "hover:text-abyss"}`}>
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page" className={tone === "dark" ? "text-white/90" : "text-graphite"}>
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  );
}
