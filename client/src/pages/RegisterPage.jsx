import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import FloatingInput from "../components/FloatingInput";
import RippleButton from "../components/RippleButton";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePageReveal from "../animations/usePageReveal";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { showToast } = useToast();
  const containerRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  usePageReveal(containerRef, []);

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
      await register(form);
      showToast("Account created. Welcome to Noir Estates.", "success");
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
        <div data-animate="hero" className="w-full max-w-md rounded-3xl border border-darkline bg-card/85 p-8 backdrop-blur-2xl">
          <p className="text-xs uppercase tracking-[0.32em] text-accent">Private Onboarding</p>
          <h1 className="mt-2 font-display text-4xl text-white">Create Account</h1>
          <p className="mt-2 text-sm text-white/65">
            Build your profile and unlock premium listings curated for serious buyers.
          </p>
          <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-white/70">
              Quick setup. Secure access. Personalized shortlist.
            </p>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <FloatingInput
              label="Full Name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              data-animate="stagger"
            />

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
              {submitting ? "Creating" : "Create Account"}
              <ArrowRight size={16} />
            </RippleButton>
          </form>

          <div
            data-animate="stagger"
            className="mt-10 rounded-2xl border border-darkline/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.06)_0%,rgba(17,17,17,0.9)_45%,rgba(17,17,17,0.96)_100%)] px-5 py-4 text-center"
          >
            <p className="text-sm text-white/70">
              Already have access?{" "}
              <Link to="/login" className="nav-link text-accent">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
