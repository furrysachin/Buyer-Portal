import { useLayoutEffect } from "react";
import gsap from "gsap";
import { useToast } from "../context/ToastContext";

const stylesByType = {
  info: "border-white/20 text-white",
  success: "border-accent/70 text-white",
  error: "border-red-500/60 text-red-100",
};

const ToastContainer = () => {
  const { toasts } = useToast();

  useLayoutEffect(() => {
    if (!toasts.length) {
      return undefined;
    }

    gsap.fromTo(
      ".toast-item",
      {
        x: 120,
        opacity: 0,
        scale: 0.9,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: "power3.out",
      }
    );

    return () => {
      gsap.killTweensOf(".toast-item");
    };
  }, [toasts]);

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[60] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item pointer-events-auto rounded-xl border bg-card/90 px-4 py-3 text-sm backdrop-blur-xl ${
            stylesByType[toast.type] || stylesByType.info
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
