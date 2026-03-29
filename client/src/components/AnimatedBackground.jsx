import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const AnimatedBackground = () => {
  const orbARef = useRef(null);
  const orbBRef = useRef(null);
  const orbCRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.to(orbARef.current, {
        x: 120,
        y: 70,
        scale: 1.25,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(orbBRef.current, {
        x: -130,
        y: -80,
        scale: 0.85,
        duration: 13,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(orbCRef.current, {
        x: 80,
        y: -90,
        scale: 1.15,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        ref={orbARef}
        className="absolute -left-36 top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        ref={orbBRef}
        className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-accent/15 blur-3xl"
      />
      <div
        ref={orbCRef}
        className="absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-accent/10 blur-3xl"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0.95)_52%)]" />
    </div>
  );
};

export default AnimatedBackground;
