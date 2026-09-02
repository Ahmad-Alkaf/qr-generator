import { MARK_PATH, MARK_VIEWBOX, BRAND_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** The QR Anvil mark. Inherits `currentColor`, so set a text colour on it. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <path d={MARK_PATH} />
    </svg>
  );
}

/**
 * Mark plus wordmark, with an optional tagline line under the name,
 * in the same lockup structure as the SetupForge header.
 */
export function Logo({
  size = "md",
  tagline = false,
  className,
}: {
  size?: "sm" | "md" | "lg";
  tagline?: boolean;
  className?: string;
}) {
  const mark = size === "lg" ? "size-10" : size === "sm" ? "size-7" : "size-8";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mark className={cn(mark, "text-primary")} />
      <span className="flex flex-col leading-none">
        <span className={cn("font-heading font-bold tracking-tight", text)}>
          <span className="text-primary">QR</span>
          <span className="text-gray-900 dark:text-white"> Anvil</span>
        </span>
        {tagline && (
          <span className="mt-1 font-heading text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            {BRAND_TAGLINE}
          </span>
        )}
      </span>
    </span>
  );
}
