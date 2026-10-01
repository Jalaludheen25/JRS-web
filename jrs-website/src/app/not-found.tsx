import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Eyebrow } from "@/components/ui/primitives";
import { quoteHref } from "@/lib/site";

const shortcuts = [
  { label: "Products", href: "/products/" },
  { label: "Engine overhaul service", href: "/engine-overhaul-service-in-abu-dhabi/" },
  { label: "Turbocharger overhauls", href: "/turbocharger-overhauls-in-abu-dhabi/" },
  { label: "Contact", href: "/contact/" },
];

export default function NotFound() {
  return (
    <section className="shell flex min-h-[90svh] flex-col justify-end pb-24 pt-40">
      <Eyebrow>Error 404 — Out of tolerance</Eyebrow>
      <h1 className="display mt-8 text-[clamp(3.5rem,12vw,12rem)] text-white">
        Page not
        <br />
        <span className="accent text-steel-300">found.</span>
      </h1>
      <p className="mt-8 max-w-md text-[17px] text-fog/75">This page has moved or no longer exists. These links will get you back on course.</p>
      <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        {shortcuts.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="link-underline text-[15px] text-white">
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-12">
        <MagneticButton href={quoteHref}>Request a quote</MagneticButton>
      </div>
    </section>
  );
}
