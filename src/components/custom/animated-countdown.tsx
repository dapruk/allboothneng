import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AnimatedCountdown = ({ countdown }: { countdown: number }) => {
  const countdownRef = useRef(null);

  useEffect(() => {
    if (countdownRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        countdownRef.current,
        {
          scale: 0,
          rotation: 180,
          opacity: 0,
        },
        {
          scale: 1.2,
          rotation: 0,
          opacity: 1,
          duration: 0.3,
          ease: "back.out(2)",
        }
      )
        .to(countdownRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        })
        .to(countdownRef.current, {
          scale: 1.05,
          duration: 0.25,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        })
        .to(countdownRef.current, {
          scale: 0.8,
          opacity: 0.7,
          duration: 0.25,
          ease: "power2.in",
        });
    }
  }, [countdown]);

  const getCountdownColor = (count: number) => {
    switch (count) {
      case 1:
        return "text-green-400";
      case 2:
        return "text-yellow-400";
      case 3:
        return "text-orange-400";
      default:
        return "text-red-400";
    }
  };

  return (
    <h1
      ref={countdownRef}
      className={`font-bold text-9xl drop-shadow-lg ${getCountdownColor(countdown)}`}
    >
      {countdown}
    </h1>
  );
};

export default AnimatedCountdown;
