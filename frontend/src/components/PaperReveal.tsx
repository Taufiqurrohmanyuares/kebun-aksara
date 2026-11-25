"use client";

import { useEffect, useRef, useState } from "react";

interface PaperRevealProps {
  children: React.ReactNode;
  delay?: number; // jeda dalam ms (misal 0, 100, 200)
  className?: string;
}

export default function PaperReveal({
  children,
  delay = 0,
  className = "",
}: PaperRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`paper-reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}