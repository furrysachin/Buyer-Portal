import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const CursorGlow = () => {
  const glowRef = useRef(null);
  const dotRef = useRef(null);

  useLayoutEffect(() => {
    const canTrackCursor = window.matchMedia("(pointer:fine)").matches;

    if (!canTrackCursor || !glowRef.current) {
      return undefined;
    }

    const moveX = gsap.quickTo(glowRef.current, "x", {
      duration: 0.32,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(glowRef.current, "y", {
      duration: 0.32,
      ease: "power3.out",
    });

    const handlePointerMove = (event) => {
      moveX(event.clientX);
      moveY(event.clientY);
    };

    const handlePointerDown = () => {
      gsap.to(glowRef.current, {
        scale: 0.9,
        duration: 0.18,
        ease: "power2.out",
      });
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          scale: 0.72,
          duration: 0.18,
          ease: "power2.out",
        });
      }
    };

    const handlePointerUp = () => {
      gsap.to(glowRef.current, {
        scale: 1,
        duration: 0.22,
        ease: "power2.out",
      });
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          scale: 1,
          duration: 0.22,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div ref={glowRef} className="cursor-glow" aria-hidden>
      <span ref={dotRef} className="cursor-glow__dot" />
    </div>
  );
};

export default CursorGlow;
