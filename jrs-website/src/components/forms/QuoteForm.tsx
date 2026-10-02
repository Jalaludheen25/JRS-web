"use client";

import { useActionState, useId } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { submitQuote, type QuoteState } from "@/app/actions";
import { products, services } from "@/lib/content";

const initial: QuoteState = { status: "idle" };

export function QuoteForm({ tone = "dark", defaultTopic = "" }: { tone?: "dark" | "blue"; defaultTopic?: string }) {
  const [state, action, pending] = useActionState(submitQuote, initial);
  const uid = useId();
  const err = state.fieldErrors ?? {};

  const field =
    "peer w-full border-0 border-b bg-transparent px-0 pb-3 pt-6 text-[16px] text-white placeholder-transparent transition-colors focus:outline-none focus:ring-0 " +
    (tone === "blue" ? "border-white/35 focus:border-white" : "border-white/20 focus:border-marine-bright");
  const label =
    "label pointer-events-none absolute left-0 top-6 origin-left text-white/60 transition-all duration-300 peer-focus:top-0 peer-focus:scale-90 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-90";

  const input = (name: "name" | "company" | "email" | "phone", text: string, type = "text", required = false, autoComplete?: string) => {
    const id = `${uid}-${name}`;
    const e = err[name as keyof typeof err];
    return (
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={text}
          aria-invalid={e ? true : undefined}
          aria-describedby={e ? `${id}-err` : undefined}
          className={field}
        />
        <label htmlFor={id} className={label}>
          {text}
          {required && <span aria-hidden> *</span>}
        </label>
        {e && (
          <p id={`${id}-err`} className="mt-2 text-[13px] text-red-300">
            {e}
          </p>
        )}
      </div>
    );
  };

  return (
    <form action={action} noValidate className="relative grid gap-x-8 gap-y-8 sm:grid-cols-2" aria-describedby={`${uid}-status`}>
      {input("name", "Name", "text", true, "name")}
      {input("company", "Company", "text", false, "organization")}
      {input("email", "Email", "email", true, "email")}
      {input("phone", "Phone", "tel", false, "tel")}

      <div className="relative sm:col-span-2">
        <label htmlFor={`${uid}-topic`} className="label text-white/60">
          Service / product
        </label>
        <select
          id={`${uid}-topic`}
          name="topic"
          defaultValue={defaultTopic}
          className={`${field} mt-1 cursor-pointer appearance-none pt-3 [&>*]:bg-navy-900`}
        >
          <option value="">Select a product or service</option>
          <optgroup label="Products">
            {products.map((p) => (
              <option key={p.slug}>{p.name}</option>
            ))}
          </optgroup>
          <optgroup label="Services">
            {services.map((s) => (
              <option key={s.href}>{s.title}</option>
            ))}
          </optgroup>
          <option>Other / not sure</option>
        </select>
      </div>

      <div className="relative sm:col-span-2">
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={4}
          required
          placeholder="Message"
          aria-invalid={err.message ? true : undefined}
          aria-describedby={err.message ? `${uid}-message-err` : undefined}
          className={`${field} resize-none`}
        />
        <label htmlFor={`${uid}-message`} className={label}>
          Engine make, model, part numbers, quantity <span aria-hidden>*</span>
        </label>
        {err.message && (
          <p id={`${uid}-message-err`} className="mt-2 text-[13px] text-red-300">
            {err.message}
          </p>
        )}
      </div>

      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${uid}-status`} role="status" aria-live="polite" className={`text-[14px] ${state.status === "success" ? "text-signal" : "text-red-200"}`}>
          {state.message}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white px-8 text-[13px] font-semibold uppercase tracking-[0.1em] text-abyss transition-colors hover:bg-plate disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Send request
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
        </button>
      </div>
    </form>
  );
}
