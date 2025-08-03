import { useEffect, useRef } from "react";
import { gsap } from "gsap/gsap-core";

interface PageEntryAnimationProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export const PageEntryAnimation: React.FC<PageEntryAnimationProps> = ({
  children,
  duration = 0.8,
  delay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    gsap.set(element, {
      opacity: 0,
      scale: 0.6,
    });

    gsap.to(element, {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease: "power2.out",
    });
  }, [duration, delay]);

  return (
    <div ref={containerRef} className="relative z-10 w-full h-full">
      {children}
    </div>
  );
};
