import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const base =
  "group inline-flex items-center gap-sm font-medium uppercase tracking-[0.14em] " +
  "transition-[transform,background-color,color,border-color,opacity] duration-200 " +
  "ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background px-xl py-md text-[13px] rounded-[2px] md:px-2xl " +
    "hover:-translate-y-0.5 hover:bg-[#f0f0f0] motion-reduce:hover:translate-y-0",
  ghost:
    "text-muted-foreground text-[12px] py-md hover:text-foreground",
};

/**
 * Editorial link-button used across the site. Renders an anchor because every
 * call site so far navigates rather than submits.
 */
export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={[base, variants[variant], className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </a>
  );
}
