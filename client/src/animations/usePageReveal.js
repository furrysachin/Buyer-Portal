import { useLayoutEffect } from "react";
import gsap from "gsap";

const usePageReveal = (containerRef, deps = []) => {
  useLayoutEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      const navItems = gsap.utils.toArray("[data-animate='navbar']");
      if (navItems.length) {
        timeline.from(navItems, {
          y: -50,
          opacity: 0,
          duration: 0.7,
        });
      }

      const hero = gsap.utils.toArray("[data-animate='hero']");
      if (hero.length) {
        timeline.from(
          hero,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            y: 20,
            opacity: 0,
            duration: 0.9,
          },
          navItems.length ? "-=0.35" : 0
        );
      }

      const staggerItems = gsap.utils.toArray("[data-animate='stagger']");
      if (staggerItems.length) {
        timeline.from(
          staggerItems,
          {
            y: 32,
            opacity: 0,
            stagger: 0.08,
            duration: 0.55,
          },
          "-=0.5"
        );
      }
    }, containerRef);

    return () => {
      context.revert();
    };
  }, deps);
};

export default usePageReveal;
