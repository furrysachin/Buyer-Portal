import { forwardRef, useRef, useState } from "react";

const RippleButton = forwardRef(
  (
    {
      children,
      className = "",
      onClick,
      type = "button",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState([]);
    const lastTriggerRef = useRef(0);

    const trigger = (event) => {
      if (disabled) {
        return;
      }

      const now = Date.now();
      if (now - lastTriggerRef.current < 220) {
        return;
      }
      lastTriggerRef.current = now;

      const rect = event.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const point =
        event.changedTouches && event.changedTouches[0]
          ? event.changedTouches[0]
          : event;
      const clientX =
        typeof point.clientX === "number" ? point.clientX : rect.left + rect.width / 2;
      const clientY =
        typeof point.clientY === "number" ? point.clientY : rect.top + rect.height / 2;
      const x = clientX - rect.left - size / 2;
      const y = clientY - rect.top - size / 2;
      const id = Date.now();

      setRipples((prev) => [...prev, { id, x, y, size }]);

      window.setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 650);

      onClick?.(event);
    };

    const handleClick = (event) => {
      trigger(event);
    };

    const handlePointerUp = (event) => {
      if (event.pointerType === "touch") {
        trigger(event);
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        className={`ripple-btn luxury-button ${className}`}
        onClick={handleClick}
        onPointerUp={handlePointerUp}
        disabled={disabled}
        {...props}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="ripple-wave"
            style={{
              width: ripple.size,
              height: ripple.size,
              left: ripple.x,
              top: ripple.y,
            }}
          />
        ))}
        <span className="relative z-[1]">{children}</span>
      </button>
    );
  }
);

RippleButton.displayName = "RippleButton";

export default RippleButton;
