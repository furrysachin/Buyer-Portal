import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useScrollReveal = (containerRef, deps = []) => {
  useLayoutEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const context = gsap.context(() => {
      const targets = gsap.utils.toArray("[data-scroll]");

      targets.forEach((target) => {
        gsap.fromTo(
          target,
          {
            y: 58,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: target,
              start: "top 84%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => {
      context.revert();
    };
  }, deps);
};

export default useScrollReveal;
