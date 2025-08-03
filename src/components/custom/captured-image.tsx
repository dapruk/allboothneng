import { useEffect, useRef } from "react";
import gsap from "gsap";

interface CapturedImageProps {
  src: string;
  alt: string;
  totalImages: number;
}

export default function CapturedImage({
  src,
  alt,
  totalImages,
}: CapturedImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    if (!hasAnimated.current) {
      gsap.set(image, {
        y: 80,
        opacity: 0,
        scale: 0.8,
        rotation: gsap.utils.random(-10, 10),
      });

      gsap.to(image, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.4)",
        delay: 0.1,
      });

      hasAnimated.current = true;
    }
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image || !hasAnimated.current) return;

    if (hasAnimated.current) {
      gsap.to(image, {
        scale: 1.05,
        duration: 0.15,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  }, [totalImages]);

  return (
    <img
      ref={imageRef}
      className="rounded-3xl border-4 border-white drop-shadow-md h-full object-cover"
      src={src}
      alt={alt}
    />
  );
}
