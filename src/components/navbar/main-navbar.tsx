import { JSX, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface CosmicParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  twinkle: number;
  twinkleSpeed: number;
  color: string;
}

export default function MainNavbar(): JSX.Element {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const text = textRef.current;
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!text || !container || !canvas) return;

    const letters: HTMLSpanElement[] = text
      .textContent!.split("")
      .map((letter: string) => {
        const span = document.createElement("span");
        span.textContent = letter === " " ? "\u00A0" : letter;
        span.style.display = "inline-block";
        span.style.position = "relative";
        return span;
      });

    text.innerHTML = "";
    letters.forEach((letter: HTMLSpanElement) => text.appendChild(letter));

    //ENTRANCE
    const entranceTimeline = gsap.timeline();

    gsap.set(letters, {
      scaleY: 0.1,
      scaleX: 3,
      opacity: 0,
      filter: "blur(10px)",
      y: 20,
    });

    entranceTimeline.to(letters, {
      scaleY: 1,
      scaleX: 1,
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
      stagger: 0.1,
    });

    // CONTINUOUS IDLE
    // Replace your current CONTINUOUS IDLE section with this fixed playful dancing code:

    // PLAYFUL DANCING LETTERS
    setTimeout(() => {
      letters.forEach((letter: HTMLSpanElement, index: number) => {
        // Give each letter a playful "personality"
        const letterChar = letter.textContent?.toLowerCase() || "";
        const danceStyle = getDancePersonality(letterChar, index);

        // Start the dance party!
        playfulDance(letter, danceStyle, index);
      });
    }, 2000);

    // Dance personality based on letter character
    function getDancePersonality(char: string, index: number): string {
      const personalities: { [key: string]: string } = {
        // Bouncy letters
        a: "bouncy",
        e: "bouncy",

        // Wiggly letters
        l: "wiggly",
        s: "wiggly",
        n: "wiggly",

        // Spinning letters
        b: "spinner",
        o: "spinner",
        g: "spinner",

        // Shy letters (subtle movements)
        t: "shy",
        h: "shy",
      };

      return (
        personalities[char] || (index % 2 === 0 ? "freestyle" : "copy_cat")
      );
    }

    function playfulDance(
      letter: HTMLSpanElement,
      style: string,
      index: number
    ): void {
      const baseDelay = index * 0.1;

      switch (style) {
        case "bouncy": {
          // Happy bouncing like a rubber ball
          gsap.to(letter, {
            y: "random(-15, -8)",
            duration: "random(0.3, 0.5)",
            ease: "power2.out",
            repeat: -1,
            yoyo: true,
            repeatDelay: gsap.utils.random(0.2, 0.8),
            delay: baseDelay,
          });

          // Add occasional extra big bounce
          gsap.to(letter, {
            scale: "random(1.1, 1.3)",
            duration: 0.2,
            ease: "elastic.out(1, 0.3)",
            repeat: -1,
            repeatDelay: gsap.utils.random(3, 6),
            delay: baseDelay + 1,
          });
          break;
        }

        case "wiggly": {
          // Silly wiggle dance
          const wiggleTl = gsap.timeline({ repeat: -1, delay: baseDelay });
          wiggleTl
            .to(letter, { rotation: 5, x: 3, duration: 0.15 })
            .to(letter, { rotation: -8, x: -4, duration: 0.2 })
            .to(letter, { rotation: 3, x: 2, duration: 0.15 })
            .to(letter, { rotation: 0, x: 0, duration: 0.25 })
            .to(letter, {}, `+=${gsap.utils.random(0.5, 2)}`); // random pause
          break;
        }

        case "spinner": {
          // Playful spinning with pauses
          gsap.to(letter, {
            rotation: 360,
            duration: "random(1, 2)",
            ease: "power2.inOut",
            repeat: -1,
            repeatDelay: gsap.utils.random(2, 4),
            delay: baseDelay,
          });

          // Add bounce during spin
          gsap.to(letter, {
            y: "random(-5, 5)",
            duration: "random(0.8, 1.2)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: baseDelay + 0.5,
          });
          break;
        }

        case "shy": {
          // Gentle, timid movements
          gsap.to(letter, {
            y: "random(-3, 3)",
            rotation: "random(-1, 1)",
            duration: "random(2, 4)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: baseDelay,
          });

          // Occasional peek-a-boo
          gsap.to(letter, {
            scale: 0.8,
            duration: 0.3,
            ease: "back.out(1.7)",
            repeat: -1,
            yoyo: true,
            repeatDelay: gsap.utils.random(5, 10),
            delay: baseDelay + 2,
          });
          break;
        }

        case "copy_cat": {
          // Copies the previous letter's movement with delay
          gsap.to(letter, {
            y: "random(-8, 8)",
            rotation: "random(-3, 3)",
            duration: "random(1, 2)",
            ease: "elastic.inOut(1, 0.3)",
            repeat: -1,
            yoyo: true,
            delay: baseDelay + 0.3, // slight delay to "copy"
          });
          break;
        }

        default: {
          // freestyle
          // Random freestyle dancing
          const freestyleTl = gsap.timeline({ repeat: -1, delay: baseDelay });

          // Create random dance sequence
          const moves = [
            { y: -12, rotation: 10, scale: 1.1, duration: 0.4 },
            { y: 5, rotation: -5, scale: 0.9, duration: 0.3 },
            { y: -8, rotation: 15, scale: 1.2, duration: 0.5 },
            { y: 0, rotation: 0, scale: 1, duration: 0.6 },
          ];

          moves.forEach((move) => {
            freestyleTl.to(letter, {
              ...move,
              ease: "back.out(1.7)",
            });
          });

          freestyleTl.to(letter, {}, `+=${gsap.utils.random(1, 3)}`); // rest period
          break;
        }
      }

      // Add occasional "show off" moments for all letters
      gsap.to(letter, {
        scale: 1.4,
        rotation: "random(-20, 20)",
        y: -20,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)",
        repeat: -1,
        yoyo: true,
        repeatDelay: gsap.utils.random(8, 15),
        delay: baseDelay + gsap.utils.random(3, 8),
      });
    }

    // Optional: Add a "dance battle" effect where letters sync up occasionally
    setTimeout(() => {
      setInterval(
        () => {
          // Every 10-15 seconds, make all letters do a synchronized move
          const syncMove = Math.random() > 0.5 ? "group_bounce" : "wave_dance";

          if (syncMove === "group_bounce") {
            letters.forEach((letter, i) => {
              gsap.to(letter, {
                y: -25,
                scale: 1.3,
                duration: 0.5,
                ease: "back.out(1.7)",
                delay: i * 0.05,
                onComplete: () => {
                  gsap.to(letter, {
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: "bounce.out",
                  });
                },
              });
            });
          } else {
            // Wave effect
            letters.forEach((letter, i) => {
              gsap.to(letter, {
                y: -15,
                rotation: 10,
                duration: 0.3,
                ease: "power2.out",
                delay: i * 0.1,
                yoyo: true,
                repeat: 1,
              });
            });
          }
        },
        gsap.utils.random(10000, 20000)
      ); // Random interval 10-20 seconds
    }, 5000);

    // NAVBAR COSMIC DUST
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const cosmicParticles: CosmicParticle[] = [];
    const particleCount: number = 80;

    const colors: string[] = ["#8276a3", "#ff6b6b", "#4ecdc4", "#45b7d1"];

    for (let i = 0; i < particleCount; i++) {
      cosmicParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.3,
        baseOpacity: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color:
          Math.random() < 0.7 ? "white" : colors[Math.floor(Math.random() * 4)],
      });
    }

    const getRgbFromColor = (color: string): string => {
      switch (color) {
        case "#8276a3":
          return "130, 118, 163";
        case "#ff6b6b":
          return "255, 107, 107";
        case "#4ecdc4":
          return "78, 205, 196";
        case "#45b7d1":
          return "69, 183, 209";
        default:
          return "255, 255, 255";
      }
    };

    function drawCosmicDust(): void {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cosmicParticles.forEach((particle: CosmicParticle) => {
        const twinkleEffect: number = Math.sin(particle.twinkle) * 0.4;
        const currentOpacity: number = particle.baseOpacity + twinkleEffect;
        const currentSize: number = particle.size + twinkleEffect * 0.5;

        if (currentOpacity > 0.6) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, currentSize * 2, 0, Math.PI * 2);
          if (particle.color === "white") {
            ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.1})`;
          } else {
            const rgb: string = getRgbFromColor(particle.color);
            ctx.fillStyle = `rgba(${rgb}, ${currentOpacity * 0.1})`;
          }
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          Math.max(0.1, currentSize),
          0,
          Math.PI * 2
        );

        if (particle.color === "white") {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, currentOpacity)})`;
        } else {
          const rgb: string = getRgbFromColor(particle.color);
          ctx.fillStyle = `rgba(${rgb}, ${Math.max(0, currentOpacity)})`;
        }
        ctx.fill();

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.twinkle += particle.twinkleSpeed;

        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;
      });

      requestAnimationFrame(drawCosmicDust);
    }

    drawCosmicDust();

    // Handle resize
    const handleResize = (): void => {
      if (!canvas || !container) return;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      gsap.killTweensOf([text, letters, container]);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolutefont-satisfy z-10 py-6 px-4 bg-white rounded-3xl drop-shadow-lg my-8 container mx-auto text-foreground hidden md:flex justify-center items-center gap-12 relative overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <span
        ref={textRef}
        className="text-[#8276a3] text-3xl font-bold relative z-10"
        style={{
          filter: "drop-shadow(0 0 10px rgba(130, 118, 163, 0.3))",
        }}
      >
        AllBoothNeng
      </span>
    </div>
  );
}
