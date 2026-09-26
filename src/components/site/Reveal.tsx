import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Aparición suave al hacer scroll. Respeta prefers-reduced-motion vía CSS.
 * `fade`: solo fundido, sin desplazamiento (documentos largos como los textos legales).
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
  fade = false,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  fade?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={fade ? "fade" : ""}
      data-visible={visible ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
