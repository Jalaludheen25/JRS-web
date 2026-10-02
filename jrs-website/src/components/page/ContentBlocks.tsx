import { Fragment } from "react";
import { splitFeature, toSections, type Block } from "@/lib/blocks";

type Tone = "light" | "dark";

const c = (tone: Tone) =>
  tone === "light"
    ? { text: "text-graphite/80", strong: "text-abyss", line: "border-graphite/14", label: "text-accent-ink", muted: "text-steel-500", card: "bg-white" }
    : { text: "text-fog/80", strong: "text-white", line: "border-white/12", label: "text-accent", muted: "text-steel-500", card: "bg-white/[0.03]" };

function List({ items, ordered, tone }: { items: string[]; ordered?: boolean; tone: Tone }) {
  const t = c(tone);
  const features = items.map(splitFeature);
  // Mostly "Title – description" items → feature grid.
  if (features.filter(Boolean).length >= Math.ceil(items.length * 0.6) && items.length > 1) {
    return (
      <ul className={`grid gap-px sm:grid-cols-2 ${tone === "light" ? "bg-graphite/12" : "bg-white/10"} border ${t.line}`}>
        {items.map((it, i) => {
          const f = features[i];
          return (
            <li key={i} className={`${t.card} p-6`}>
              <span className={`label tabular-nums ${t.label}`}>{String(i + 1).padStart(2, "0")}</span>
              {f ? (
                <>
                  <p className={`mt-3 text-[17px] font-medium leading-snug ${t.strong}`}>{f.title}</p>
                  <p className={`mt-2 text-[15px] leading-relaxed ${t.text}`}>{f.body}</p>
                </>
              ) : (
                <p className={`mt-3 text-[16px] leading-snug ${t.strong}`}>{it}</p>
              )}
            </li>
          );
        })}
      </ul>
    );
  }
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`border-t ${t.line}`}>
      {items.map((it, i) => (
        <li key={i} className={`flex gap-5 border-b py-4 ${t.line}`}>
          <span className={`label w-6 shrink-0 pt-1 tabular-nums ${t.label}`}>{ordered ? String(i + 1).padStart(2, "0") : "—"}</span>
          <span className={`text-[16px] leading-snug ${t.strong}`}>{it}</span>
        </li>
      ))}
    </Tag>
  );
}

function Blocks({ blocks, tone }: { blocks: Block[]; tone: Tone }) {
  const t = c(tone);
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className={`max-w-[66ch] text-[17px] leading-[1.7] ${t.text}`}>
                {b.text}
              </p>
            );
          case "list":
            return <List key={i} items={b.items} ordered={b.ordered} tone={tone} />;
          case "h3":
            return (
              <h3 key={i} className={`heading pt-6 text-[clamp(1.4rem,2.2vw,2rem)] ${t.strong}`}>
                {b.text}
              </h3>
            );
          default:
            return (
              <h4 key={i} className={`pt-4 text-[18px] font-medium ${t.strong}`}>
                {b.text}
              </h4>
            );
        }
      })}
    </div>
  );
}

/** Editorial sections: sticky numbered H2 on the left, content on the right. */
export function ContentBlocks({ blocks, tone = "dark" }: { blocks: Block[]; tone?: Tone }) {
  const t = c(tone);
  const sections = toSections(blocks);
  return (
    <div className="space-y-[clamp(56px,7vw,112px)]">
      {sections.map((s, i) => (
        <section key={i} className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            {!s.heading && <p className={`label ${t.label}`}>Overview</p>}
            {s.heading && (
              <div className="lg:sticky lg:top-28">
                <p className={`label tabular-nums ${t.label}`}>{String(i + (sections[0].heading ? 1 : 0)).padStart(2, "0")}</p>
                <h2 className={`heading mt-4 text-[clamp(1.75rem,3vw,2.75rem)] ${t.strong}`}>{s.heading}</h2>
              </div>
            )}
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Blocks blocks={s.blocks} tone={tone} />
          </div>
        </section>
      ))}
    </div>
  );
}

/** Single-column long-form layout for insights. */
export function ArticleBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mx-auto max-w-[720px] space-y-6">
      {blocks.map((b, i) => (
        <Fragment key={i}>
          {b.type === "h2" ? (
            <h2 className="heading pt-10 text-[clamp(1.75rem,3vw,2.5rem)] text-abyss">{b.text}</h2>
          ) : (
            <Blocks blocks={[b]} tone="light" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
