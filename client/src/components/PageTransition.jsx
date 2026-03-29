import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const PageTransition = ({ children, className = "" }) => {
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        {
          clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
          opacity: 0.4,
        },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          opacity: 1,
          duration: 1,
          ease: "power4.out",
        }
      );
    }, wrapperRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
};

export default PageTransition;
