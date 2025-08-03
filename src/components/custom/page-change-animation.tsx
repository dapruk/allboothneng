import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { gsap } from "gsap/gsap-core";

interface PageChangeAnimationProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export const PageChangeAnimation: React.FC<PageChangeAnimationProps> = ({
  children,
  duration = 0.6,
  delay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    gsap.set(element, {
      opacity: 0,
      scale: 0.95,
    });

    gsap.to(element, {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease: "power2.out",
    });
  }, [location.pathname, duration, delay]);

  return (
    <div ref={containerRef} className="relative z-10 w-full h-full">
      {children}
    </div>
  );
};
