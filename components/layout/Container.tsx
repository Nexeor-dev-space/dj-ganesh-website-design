import type { CSSProperties, ElementType, ReactNode } from "react";

type ContainerProps = {
  /** Semantic element to render. Defaults to `div`. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * The site-wide horizontal layout wrapper.
 * Every section should sit inside a Container so the page keeps one
 * consistent gutter and max-width across all breakpoints.
 */
export function Container({
  as: Component = "div",
  className,
  style,
  children,
}: ContainerProps) {
  return (
    <Component
      className={["container-page", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </Component>
  );
}
