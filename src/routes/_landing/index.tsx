import { useRef, useEffect, JSX } from "react";
import { gsap } from "gsap";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AnimatedButton from "@/components/custom/button";
import { Play } from "lucide-react";

export const Route = createFileRoute("/_landing/")({
  component: LandingIndexPageComponent,
});

function LandingIndexPageComponent(): JSX.Element {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const titleElement = titleRef.current;
    const subtitleElement = subtitleRef.current;
    const titleContainer = titleContainerRef.current;

    if (!titleElement || !subtitleElement || !titleContainer) return;

    const setupTypewriter = (
      element: HTMLElement,
      text: string,
      startDelay: number,
      speed: number,
      sparkleColor: string = "#fbbf24"
    ): gsap.core.Timeline => {
      element.innerHTML = text
        .split("")
        .map(
          (char, index) =>
            `<span class="char-${index}" style="opacity: 0;">${char === " " ? "&nbsp;" : char}</span>`
        )
        .join("");

      const chars =
        element.querySelectorAll<HTMLSpanElement>('[class^="char-"]');
      const tl = gsap.timeline({ delay: startDelay });

      chars.forEach((char, index) => {
        tl.to(
          char,
          {
            opacity: 1,
            duration: 0.05,
            ease: "none",
          },
          index * speed
        ).call(
          () => {
            const sparkle = document.createElement("div");
            sparkle.className =
              "absolute pointer-events-none w-1 h-1 rounded-full z-10";
            sparkle.style.backgroundColor = sparkleColor;
            sparkle.style.left = `${char.offsetLeft + char.offsetWidth + Math.random() * 20 - 10}px`;
            sparkle.style.top = `${char.offsetTop + char.offsetHeight / 2 + Math.random() * 20 - 10}px`;
            sparkle.style.opacity = "0.8";

            titleContainer!.appendChild(sparkle);

            gsap.fromTo(
              sparkle,
              { scale: 0, rotation: 0 },
              {
                scale: 1,
                rotation: 360,
                duration: 0.5,
                ease: "power2.out",
              }
            );

            gsap.to(sparkle, {
              opacity: 0,
              scale: 0,
              duration: 0.5,
              delay: 0.5,
              onComplete: () => sparkle.remove(),
            });
          },
          undefined,
          index * speed
        );
      });

      return tl;
    };

    const titleTimeline = setupTypewriter(
      titleElement,
      "AllBoothNeng",
      0.8,
      0.08,
      "#d8b4fe"
    );
    const subtitleTimeline = setupTypewriter(
      subtitleElement,
      "Photobooth",
      2.5,
      0.1,
      "#d8b4fe"
    );

    return () => {
      titleTimeline.kill();
      subtitleTimeline.kill();
    };
  }, []);

  return (
    <>
      <div className="flex flex-col h-[100vh]  z-10 items-center justify-center px-4">
        <div className="justify-center grid grid-cols-1 space-y-4 mb-8">
          <div
            ref={titleContainerRef}
            className="text-center text-[#8276a3] relative"
            style={{ transformOrigin: "center" }}
          >
            <h1
              ref={titleRef}
              className="font-satisfy font-bold text-9xl drop-shadow-sm"
            ></h1>
            <p ref={subtitleRef} className="font-satisfy text-6xl"></p>
          </div>
        </div>

        <AnimatedButton
          size="lg"
          fromColor={{
            background: "#FFFFFF",
            text: "#8276a3",
          }}
          toColor={{
            background: "#8276a3",
            text: "#FFFFFF",
          }}
          onClick={() => navigate({ to: "/photobooth" })}
        >
          <Play />
          <span className="font-bold text-2xl">Start</span>
        </AnimatedButton>
      </div>
    </>
  );
}
