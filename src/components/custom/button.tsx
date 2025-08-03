import { useEffect, useRef } from "react";
import gsap from "gsap";

type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ColorConfig {
  background: string;
  text: string;
}

interface AnimatedButtonProps {
  children: React.ReactNode;
  size?: ButtonSize;
  className?: string;
  fromColor?: ColorConfig;
  toColor?: ColorConfig;
  onClick?: () => void;
  appearDelay?: number;
  appearDuration?: number;
  disappearDuration?: number;
  isVisible?: boolean; // Control visibility externally if needed
}

const sizeConfig = {
  sm: {
    padding: "h-9 px-2",
    text: "text-sm",
  },
  md: {
    padding: "h-10 px-3",
    text: "text-sm",
  },
  lg: {
    padding: "h-12 px-4",
    text: "text-base",
  },
  xl: {
    padding: "h-14 px-6",
    text: "text-base",
  },
};

const defaultFromColor: ColorConfig = {
  background: "transparent",
  text: "#000000",
};

const defaultToColor: ColorConfig = {
  background: "#1f2937",
  text: "#ffffff",
};

export default function AnimatedButton({
  children,
  size = "md",
  className = "",
  fromColor = defaultFromColor,
  toColor = defaultToColor,
  onClick,
  appearDelay = 0,
  appearDuration = 0.6,
  disappearDuration = 0.4,
  isVisible = true,
}: AnimatedButtonProps) {
  const circleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const hasAppeared = useRef(false);

  //ENTRY AND EXIT
  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    if (isVisible && !hasAppeared.current) {
      gsap.set(button, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: "center center",
      });

      gsap.set(text, {
        opacity: 0,
      });

      const timeline = gsap.timeline({ delay: appearDelay });
      timeline
        .to(button, {
          scaleX: 1,
          opacity: 1,
          duration: appearDuration,
          ease: "power2.out",
        })
        .to(
          text,
          {
            opacity: 1,
            duration: appearDuration * 0.6,
            ease: "power2.out",
          },
          `-=${appearDuration * 0.4}`
        );

      hasAppeared.current = true;
    } else if (!isVisible && hasAppeared.current) {
      const timeline = gsap.timeline();
      timeline
        .to(text, {
          opacity: 0,
          duration: disappearDuration * 0.3,
          ease: "power2.in",
        })
        .to(
          button,
          {
            scaleX: 0,
            opacity: 0,
            duration: disappearDuration,
            ease: "power2.in",
            transformOrigin: "center center",
          },
          `-=${disappearDuration * 0.1}`
        );

      hasAppeared.current = false;
    }
  }, [isVisible, appearDelay, appearDuration, disappearDuration]);

  //HOVER
  useEffect(() => {
    const circle = circleRef.current;
    const button = buttonRef.current;
    const text = textRef.current;
    if (!circle || !button || !text) return;

    const buttonRect = button.getBoundingClientRect();
    const diameter =
      Math.sqrt(buttonRect.width ** 2 + buttonRect.height ** 2) * 1.2;

    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    circle.style.left = "50%";
    circle.style.top = "50%";
    circle.style.transform = "translate(-50%, -50%)";
    circle.style.backgroundColor = toColor.background;

    gsap.set(circle, {
      scale: 0,
      transformOrigin: "center center",
      opacity: 1,
    });

    gsap.set(text, {
      color: fromColor.text,
    });

    const handleMouseEnter = () => {
      const timeline = gsap.timeline();
      timeline
        .to(circle, {
          scale: 1,
          duration: 0.4,
          ease: "power4.out",
        })
        .to(
          text,
          {
            color: toColor.text,
            duration: 0.2,
            ease: "power4.out",
          },
          "-=0.2"
        );
    };

    const handleMouseLeave = () => {
      const timeline = gsap.timeline();
      timeline
        .to(text, {
          color: fromColor.text,
          duration: 0.3,
          ease: "power4.out",
        })
        .to(
          circle,
          {
            scale: 0,
            duration: 0.4,
            ease: "power1.out",
          },
          -0.1
        );
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [fromColor, toColor]);

  const config = sizeConfig[size];

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden rounded-full bg-transparent transition-all duration-300 hover:shadow-lg ${config.padding} ${className}`}
      style={{
        backgroundColor: fromColor.background,
      }}
      onClick={onClick}
    >
      <div
        ref={circleRef}
        className="absolute"
        style={{
          borderRadius: "50%",
          backgroundColor: toColor.background,
        }}
      />
      <span
        ref={textRef}
        className={`relative flex items-center justify-center gap-1 z-10 font-semibold ${config.text}`}
        style={{ color: fromColor.text }}
      >
        {children}
      </span>
    </button>
  );
}
