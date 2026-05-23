import React, { useEffect, useRef } from "react";

/** Staggered child — use inside RevealSection */
export function Reveal({ children, className = "", delay = "0s", as: Tag = "div", ...props }) {
  const classes = ["reveal-item", className].filter(Boolean).join(" ");
  return (
    <Tag className={classes} style={{ "--d": delay }} {...props}>
      {children}
    </Tag>
  );
}

/**
 * Premium scroll-reveal block (mesh header + card body), shared by Home & About.
 */
export default function RevealSection({
  className = "",
  ariaLabel,
  eyebrow,
  title,
  description,
  compactHeader = false,
  noCard = false,
  children,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hasHeader = eyebrow || title || description;
  const headerClass = [
    "reveal-header",
    compactHeader && "reveal-header--compact",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {hasHeader && (
        <header className={headerClass}>
          <div className="reveal-header-bg" aria-hidden="true">
            <span className="reveal-mesh" />
            <span className="reveal-glow reveal-glow-1" />
            <span className="reveal-glow reveal-glow-2" />
            <span className="reveal-scan" />
          </div>
          <div className="reveal-header-content">
            {eyebrow && (
              <span className="reveal-eyebrow reveal-item" style={{ "--d": "0.06s" }}>
                <span className="reveal-eyebrow-dot" />
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="reveal-title reveal-item" style={{ "--d": "0.16s" }}>
                {title}
              </h2>
            )}
            {description && (
              <p className="reveal-lead reveal-item" style={{ "--d": "0.26s" }}>
                {description}
              </p>
            )}
          </div>
        </header>
      )}
      <div className="reveal-body">{children}</div>
    </>
  );

  return (
    <section
      ref={ref}
      className={["reveal-section", className].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
    >
      {noCard ? inner : <div className="reveal-card">{inner}</div>}
    </section>
  );
}
