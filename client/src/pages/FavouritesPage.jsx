import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import LuxurySpinner from "../components/LuxurySpinner";
import RippleButton from "../components/RippleButton";
import SiteFooter from "../components/SiteFooter";
import usePageReveal from "../animations/usePageReveal";
import useScrollReveal from "../animations/useScrollReveal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { dedupeById, getEntityId } from "../utils/entityId";

const FALLBACK_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80";

const FavouritesPage = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageReveal(pageRef, []);
  useScrollReveal(pageRef, [favourites.length]);

  const fetchFavourites = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get("/favourites");
      setFavourites(dedupeById(response.data || []));
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  const handleRemove = async (propertyId) => {
    try {
      const response = await api.delete(`/favourites/${propertyId}`);
      setFavourites(dedupeById(response.data.favourites || []));
      showToast("Favourite removed.", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <PageTransition>
      <div ref={pageRef} className="min-h-screen px-4 pb-14 md:px-8">
        <Navbar userName={user?.name || "Buyer"} onLogout={handleLogout} />

        <section
          data-animate="hero"
          className="mx-auto mt-8 max-w-7xl rounded-3xl border border-darkline bg-black/45 px-6 py-8 backdrop-blur-xl"
        >
          <p data-animate="stagger" className="text-xs uppercase tracking-[0.3em] text-accent">
            Saved Portfolio
          </p>
          <h1 data-animate="stagger" className="mt-3 font-display text-4xl text-white md:text-5xl">
            My Favourites
          </h1>
          <p data-animate="stagger" className="mt-3 max-w-2xl text-sm text-white/70">
            A personal shortlist of properties that match your buying vision.
          </p>

          <RippleButton
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-full border border-darkline bg-card px-5 py-3 text-xs uppercase tracking-[0.2em] text-white/80"
            data-animate="stagger"
          >
            Back To Dashboard
          </RippleButton>
        </section>

        <section className="mx-auto mt-8 max-w-7xl">
          {loading ? (
            <div className="grid min-h-[320px] place-content-center rounded-2xl border border-darkline bg-card/50">
              <LuxurySpinner label="Loading favourites" />
            </div>
          ) : favourites.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-darkline bg-card/45 px-6 py-14 text-center text-white/65">
              No favourites saved yet. Head to dashboard and add properties.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {favourites.map((property) => {
                const propertyId = getEntityId(property);

                return (
                <article
                  key={propertyId || property.title}
                  data-scroll
                  className="overflow-hidden rounded-2xl border border-darkline bg-card"
                >
                  <img
                    src={property.image}
                    alt={property.title}
                    onError={(event) => {
                      const image = event.currentTarget;

                      if (image.dataset.fallbackApplied === "true") {
                        return;
                      }

                      image.dataset.fallbackApplied = "true";
                      image.src = FALLBACK_PROPERTY_IMAGE;
                    }}
                    className="h-56 w-full object-cover"
                  />
                  <div className="space-y-3 p-5">
                    <h3 className="font-display text-2xl text-white">{property.title}</h3>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/60">{property.location}</p>
                    <p className="text-sm text-white/75">{property.description}</p>
                    <RippleButton
                      disabled={!propertyId}
                      onClick={() => handleRemove(propertyId)}
                      className="rounded-full border border-accent/60 bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white"
                    >
                      Remove Favourite
                    </RippleButton>
                  </div>
                </article>
                );
              })}
            </div>
          )}
        </section>

        <SiteFooter />
      </div>
    </PageTransition>
  );
};

export default FavouritesPage;
