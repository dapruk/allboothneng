import LandingLayout from "@/components/layout/landing-layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PageEntryAnimation } from "@/components/custom/page-entry-animation";

export const Route = createFileRoute("/_landing")({
  component: LandingLayoutComponent,
});

function LandingLayoutComponent() {
  const floatingImagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const config = {
      baseImageCount: 9,
      totalImages: 24,
      floatRange: 60,
      rotationRange: 360,
      duration: { min: 8, max: 15 },
      size: { min: 60, max: 120 },
    };

    const createFloatingImages = () => {
      const container = document.createElement("div");
      container.className = "floating-images-container";
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
      `;

      for (let i = 0; i < config.totalImages; i++) {
        const img = document.createElement("img");
        const assetNumber = (i % config.baseImageCount) + 1;
        img.src = `/images/floater/asset${assetNumber}.png`;
        img.className = `floating-image floating-image-${i}`;

        const size = gsap.utils.random(config.size.min, config.size.max);
        img.style.cssText = `
          position: absolute;
          opacity: 0;
          width: ${size}px;
          height: ${size}px;
          object-fit: contain;
          will-change: transform;
        `;

        const margin = 20;
        const startX = gsap.utils.random(
          margin,
          window.innerWidth - size - margin
        );
        const startY = gsap.utils.random(
          margin,
          window.innerHeight - size - margin
        );

        img.style.left = `${startX}px`;
        img.style.top = `${startY}px`;

        container.appendChild(img);
        floatingImagesRef.current.push(img);
      }

      document.body.appendChild(container);
      return container;
    };

    const animateImages = () => {
      floatingImagesRef.current.forEach((img) => {
        const animateImage = () => {
          const duration = gsap.utils.random(
            config.duration.min,
            config.duration.max
          );

          const opacity = gsap.utils.random(0.4, 0.7);

          const size = parseInt(img.style.width);
          const margin = 20;

          const endX = gsap.utils.random(
            margin,
            window.innerWidth - size - margin
          );
          const endY = gsap.utils.random(
            margin,
            window.innerHeight - size - margin
          );

          const tl = gsap.timeline({
            onComplete: () => {
              gsap.delayedCall(gsap.utils.random(1, 4), animateImage);
            },
          });

          tl.to(img, {
            x: endX,
            y: endY,
            rotation: gsap.utils.random(
              -config.rotationRange,
              config.rotationRange
            ),
            duration: duration,
            ease: "power2.inOut",
            opacity: opacity,
          })
            .to(
              img,
              {
                y: `+=${gsap.utils.random(-config.floatRange, config.floatRange)}`,
                duration: duration * 0.3,
                ease: "sine.inOut",
                yoyo: true,
                repeat: Math.floor(duration / 2),
              },
              0
            )
            .to(
              img,
              {
                x: `+=${gsap.utils.random(-config.floatRange * 0.5, config.floatRange * 0.5)}`,
                duration: duration * 0.4,
                ease: "sine.inOut",
                yoyo: true,
                repeat: Math.floor(duration / 1.5),
              },
              0
            );
        };

        gsap.delayedCall(gsap.utils.random(0, 8), () => {
          gsap.to(img, {
            opacity: gsap.utils.random(0.4, 0.7),
            scale: 1,
            duration: 2,
            ease: "power2.out",
            onComplete: animateImage,
          });
        });
      });
    };

    const container = createFloatingImages();

    const imagePromises = floatingImagesRef.current.map((img) => {
      return new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });
    });

    Promise.all(imagePromises).then(() => {
      animateImages();
    });

    return () => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      floatingImagesRef.current = [];
    };
  }, []);

  return (
    <LandingLayout>
      <main className="w-full h-full relative overflow-hidden">
        <PageEntryAnimation>
          <Outlet />
        </PageEntryAnimation>
      </main>
    </LandingLayout>
  );
}
