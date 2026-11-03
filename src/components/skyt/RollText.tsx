import { cx, vars } from "@/lib/cx";

/** Letters roll up into a copy of themselves when the nearest .sk-roll-host is hovered or focused. */
export function RollText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cx("sk-roll", className)}>
      <span className="sk-sr">{children}</span>
      <span className="sk-roll__chars" aria-hidden="true">
        {Array.from(children).map((char, i) => (
          <span key={i} style={vars({ "--i": i })}>
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    </span>
  );
}
