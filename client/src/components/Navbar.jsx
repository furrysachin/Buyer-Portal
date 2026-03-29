import { useLayoutEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { LogOut, Sparkles } from "lucide-react";
import RippleButton from "./RippleButton";

const Navbar = ({ userName, onLogout }) => {
  const navRef = useRef(null);
  const navigate = useNavigate();
  const desktopTabBaseClass =
    "inline-flex rounded-full px-6 py-2.5 text-sm transition duration-200 focus-visible:outline-none focus-visible:bg-white/10 focus-visible:text-white focus-visible:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]";
  const desktopTabActiveClass =
    "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]";
  const desktopTabInactiveClass =
    "text-white/55 hover:bg-white/10 hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]";
  const mobileTabBaseClass =
    "flex-1 rounded-full px-4 py-2 text-center text-xs transition duration-200 focus-visible:outline-none focus-visible:bg-white/10 focus-visible:text-white focus-visible:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]";
  const mobileTabActiveClass =
    "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]";
  const mobileTabInactiveClass = "text-white/60 hover:bg-white/10 hover:text-white";

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        {
          y: -70,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }, navRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <nav
      ref={navRef}
      data-animate="navbar"
      className="sticky top-4 z-30 mx-auto mt-4 w-full max-w-7xl rounded-3xl border border-white/10 bg-[linear-gradient(110deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_16%,rgba(0,0,0,0.84)_40%,rgba(0,0,0,0.94)_100%)] px-4 py-3 backdrop-blur-2xl md:px-6 md:py-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/90">
            <Sparkles size={14} />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-xl text-white">Simple Buyer Portal</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/55">
              Buyer Portal
            </p>
          </div>
        </div>

        <div className="hidden flex-1 justify-center px-4 md:flex">
          <div className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-black/85 p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `${desktopTabBaseClass} ${
                  isActive ? desktopTabActiveClass : desktopTabInactiveClass
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/favourites"
              end
              className={({ isActive }) =>
                `${desktopTabBaseClass} ${
                  isActive ? desktopTabActiveClass : desktopTabInactiveClass
                }`
              }
            >
              Favourites
            </NavLink>
            <NavLink
              to="/about"
              end
              className={({ isActive }) =>
                `${desktopTabBaseClass} ${
                  isActive ? desktopTabActiveClass : desktopTabInactiveClass
                }`
              }
            >
              About
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RippleButton
            onClick={() => navigate("/favourites")}
            className="rounded-full border border-white/25 bg-black/65 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white sm:px-6 sm:text-sm"
          >
            Get Yours
          </RippleButton>
        </div>
      </div>

      <div className="mt-3 md:hidden">
        <div className="flex items-center gap-1 rounded-full border border-white/12 bg-black/85 p-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `${mobileTabBaseClass} ${
                isActive ? mobileTabActiveClass : mobileTabInactiveClass
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/favourites"
            end
            className={({ isActive }) =>
              `${mobileTabBaseClass} ${
                isActive ? mobileTabActiveClass : mobileTabInactiveClass
              }`
            }
          >
            Favourites
          </NavLink>
          <NavLink
            to="/about"
            end
            className={({ isActive }) =>
              `${mobileTabBaseClass} ${
                isActive ? mobileTabActiveClass : mobileTabInactiveClass
              }`
            }
          >
            About
          </NavLink>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-xl border border-white/12 bg-black/70 px-3 py-2">
          <p className="truncate text-xs text-white/75">{userName || "Buyer"}</p>
          <RippleButton
            onClick={onLogout}
            className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-white"
          >
            <LogOut size={12} /> Logout
          </RippleButton>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
