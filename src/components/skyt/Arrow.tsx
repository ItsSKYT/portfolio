import { cx } from "@/lib/cx";

/** The system's one drawn icon: a diagonal arrow, 1.6 stroke, currentColor. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={cx("sk-arrow", className)} viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false">
      <path
        d="M4 12 12 4M5.5 4H12v6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
