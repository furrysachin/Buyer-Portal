import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import FloatingInput from "../components/FloatingInput";
import RippleButton from "../components/RippleButton";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePageReveal from "../animations/usePageReveal";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const containerRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  usePageReveal(containerRef, []);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        ".login-panel",
        { y: 35, opacity: 0.5 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
      );
    }, containerRef);

    return () => {
      context.revert();
    };
  }, []);

  const fromPath = useMemo(() => {
    return location.state?.from || "/dashboard";
  }, [location.state]);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await login(form);
      showToast("Welcome back. Access granted.", "success");
      navigate(fromPath, { replace: true });
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div ref={containerRef} className="grid min-h-screen place-items-center px-4 py-10">
        <div className="login-panel w-full max-w-md rounded-3xl border border-darkline bg-card/85 p-8 backdrop-blur-2xl">
          <div data-animate="hero" className="mb-7">
            <p className="text-xs uppercase tracking-[0.32em] text-accent">Luxury Access</p>
            <h1 className="mt-2 font-display text-4xl text-white">Sign In</h1>
            <p className="mt-2 text-sm text-white/65">
              Enter the private buyer dashboard to manage your curated shortlist.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <FloatingInput
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              data-animate="stagger"
            />

            <FloatingInput
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              data-animate="stagger"
            />

            <RippleButton
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-accent/60 bg-accent/15 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white"
              data-animate="stagger"
            >
              {submitting ? "Signing In" : "Enter Portal"}
              <ArrowRight size={16} />
            </RippleButton>
          </form>

          <div
            data-animate="stagger"
            className="mt-10 rounded-2xl border border-darkline/90 bg-[linear-gradient(145deg,rgba(210,105,30,0.12)_0%,rgba(17,17,17,0.85)_38%,rgba(17,17,17,0.95)_100%)] px-5 py-4 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">New Buyer</p>
            <p className="mt-2 text-sm text-white/75">
              Create your account and unlock your premium property shortlist.
            </p>
            <Link
              to="/register"
              className="mt-3 inline-flex items-center justify-center rounded-full border border-accent/65 bg-accent/15 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-accent/25"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
