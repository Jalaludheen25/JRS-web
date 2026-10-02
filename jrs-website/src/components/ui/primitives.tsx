import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

/** Drawing-sheet label, e.g. "04 / 14 — Core capabilities". */
export function Eyebrow({ sheet, children, className }: { sheet?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`label flex items-center gap-3 ${className ?? "text-steel-300"}`}>
      {sheet && (
        <>
          <span className="tabular-nums">{sheet}</span>
          <span aria-hidden className="h-[2px] w-8 bg-accent" />
        </>
      )}
      <span>{children}</span>
    </p>
  );
}

export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.08em] ${className ?? ""}`}>
      <span className="link-underline pb-1 [--ul:2px]">{children}</span>
      <ArrowRight className="size-4 transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-1.5" strokeWidth={1.5} aria-hidden />
    </Link>
  );
}

/** Definition-list spec sheet. Only for sourced facts. */
export function TechnicalSpec({ rows, dark = true, className }: { rows: [string, ReactNode][]; dark?: boolean; className?: string }) {
  return (
    <dl className={className}>
      {rows.map(([k, v]) => (
        <div key={k} className={`grid grid-cols-[minmax(7rem,38%)_1fr] gap-4 border-t py-4 ${dark ? "border-white/12" : "border-graphite/14"}`}>
          <dt className={`label pt-0.5 ${dark ? "text-steel-500" : "text-steel-500"}`}>{k}</dt>
          <dd className={`text-[15px] leading-snug ${dark ? "text-fog" : "text-graphite"}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** CSS-only infinite marquee. Content is duplicated and hidden from assistive tech. */
export function Marquee({ items, reverse, duration = 48, className }: { items: string[]; reverse?: boolean; duration?: number; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((it) => (
        <li key={it} className="flex items-center">
          <span className="px-[0.45em] whitespace-nowrap">{it}</span>
          <span aria-hidden className="mx-[0.2em] inline-block size-[0.12em] rotate-45 bg-accent" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div
        className="animate-marquee flex w-max motion-reduce:animate-none"
        style={{ ["--marquee-duration" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : undefined }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/** Crop marks for framing images like a drawing viewport. */
export function CropMarks({ className }: { className?: string }) {
  const c = "absolute size-4 border-current";
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-0 ${className ?? "text-accent/70"}`}>
      <span className={`${c} -left-2 -top-2 border-l border-t`} />
      <span className={`${c} -right-2 -top-2 border-r border-t`} />
      <span className={`${c} -bottom-2 -left-2 border-b border-l`} />
      <span className={`${c} -bottom-2 -right-2 border-b border-r`} />
    </span>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
