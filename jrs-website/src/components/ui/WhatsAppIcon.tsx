import Image from "next/image";

/**
 * The WhatsApp logo supplied by JRS (public/images/whatsapp-logo.webp, trimmed to whatsapp-badge.webp by
 * scripts/make-icons.mjs). Decorative: the link around it carries the accessible name. Size it with className;
 * `px` is the largest size it is shown at, so the optimiser serves a sharp file. strokeWidth is accepted and ignored,
 * so the icon can stand in for lucide icons in shared lists.
 */
export function WhatsAppIcon({ className, px = 24 }: { className?: string; px?: number; strokeWidth?: number | string }) {
  return <Image data-img-role="logo" src="/images/whatsapp-badge.webp" alt="" aria-hidden width={px} height={px} quality={90} className={`shrink-0 rounded-full ${className ?? ""}`} />;
}
