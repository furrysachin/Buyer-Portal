import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import RippleButton from "../components/RippleButton";
import SiteFooter from "../components/SiteFooter";
import usePageReveal from "../animations/usePageReveal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const AboutPage = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  usePageReveal(pageRef, []);

  const handleLogout = () => {
    logout();
    showToast("Session closed.", "info");
    navigate("/login", { replace: true });
  };

  return (
    <PageTransition>
      <div ref={pageRef} className="min-h-screen px-4 pb-14 md:px-8">
        <Navbar userName={user?.name || "Buyer"} onLogout={handleLogout} />

        <section
          data-animate="hero"
          className="mx-auto mt-8 max-w-7xl rounded-3xl border border-darkline bg-black/45 px-6 py-8 backdrop-blur-xl md:px-10 md:py-10"
        >
          <p data-animate="stagger" className="text-xs uppercase tracking-[0.3em] text-accent">
            About Portal
          </p>
          <h1 data-animate="stagger" className="mt-3 font-display text-4xl text-white md:text-5xl">
            Account & Access
          </h1>
          <p data-animate="stagger" className="mt-3 max-w-2xl text-sm text-white/70">
            Manage your signed-in profile and keep your browsing secure.
          </p>
        </section>

        <section className="mx-auto mt-8 grid max-w-7xl gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-darkline bg-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Signed In User</p>
            <h2 className="mt-2 font-display text-3xl text-white">{user?.name || "Buyer"}</h2>
            <p className="mt-2 text-sm text-white/70">{user?.email || "No email available"}</p>
          </article>

          <article className="rounded-2xl border border-darkline bg-card p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Quick Actions</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <RippleButton
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 rounded-full border border-accent/70 bg-accent/15 px-5 py-3 text-xs uppercase tracking-[0.16em] text-white"
              >
                <Sparkles size={14} /> Dashboard
              </RippleButton>

              <RippleButton
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs uppercase tracking-[0.16em] text-white"
              >
                <LogOut size={14} /> Logout
              </RippleButton>
            </div>
          </article>
        </section>

        <SiteFooter />
      </div>
    </PageTransition>
  );
};

export default AboutPage;
