import { Link } from "react-router-dom";
import { Mail, MapPin, Sparkles } from "lucide-react";

const footerLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/favourites", label: "Favourites" },
  { to: "/about", label: "About" },
];

const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto mt-14 max-w-7xl overflow-hidden rounded-3xl border border-darkline bg-card/70 backdrop-blur-xl">
      <div className="relative">
        <div className="pointer-events-none absolute -left-10 top-0 h-36 w-36 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-white/5 blur-3xl" />

        <div className="grid gap-8 px-6 py-8 md:grid-cols-3 md:px-8">
          <section>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-accent">
              <Sparkles size={14} /> Simple Buyer Portal 
            </p>
            <h3 className="mt-3 font-display text-3xl text-white">Simple Buyer Portal Desk</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              Curated premium properties for focused buyers. Shortlist, compare, and close with
              confidence.
            </p>
          </section>

          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Quick Links</p>
            <div className="mt-4 flex flex-col gap-2">
              {footerLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="inline-flex w-fit rounded-full border border-transparent px-4 py-2 text-sm text-white/70 transition hover:border-accent/45 hover:bg-accent/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Connect</p>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <p className="inline-flex items-center gap-2">
                <Mail size={14} className="text-accent" />
                support@portal .com
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-accent" />
                Mumbai, India
              </p>
            </div>
            <Link
              to="/favourites"
              className="mt-5 inline-flex rounded-full border border-accent/60 bg-accent/12 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-accent/22"
            >
              Open Saved Portfolio
            </Link>
          </section>
        </div>

        <div className="border-t border-darkline/80 px-6 py-4 text-center text-xs uppercase tracking-[0.17em] text-white/55 md:px-8">
          {year} Simple Buyer Portal . Private Buyer Experience.
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
