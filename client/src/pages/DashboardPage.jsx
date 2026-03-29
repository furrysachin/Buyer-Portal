import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Sparkles } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePageReveal from "../animations/usePageReveal";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import PropertyCard from "../components/PropertyCard";
import LuxurySpinner from "../components/LuxurySpinner";
import RippleButton from "../components/RippleButton";
import SiteFooter from "../components/SiteFooter";
import { dedupeById, getEntityId } from "../utils/entityId";

const HERO_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
];
const HERO_IMAGE_COUNT = 15;

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [properties, setProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [pendingFavouriteIds, setPendingFavouriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const heroImages = useMemo(() => {
    const fromListings = properties
      .map((property) => property?.image)
      .filter(Boolean);
    const uniqueImages = [...new Set([...fromListings, ...HERO_FALLBACK_IMAGES])];
    return uniqueImages.slice(0, HERO_IMAGE_COUNT);
  }, [properties]);

  useEffect(() => {
    if (!heroImages.length) {
      return;
    }

    setActiveHeroIndex((current) => Math.min(current, heroImages.length - 1));
  }, [heroImages]);

  usePageReveal(pageRef, []);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [propertiesResponse, favouritesResponse] = await Promise.all([
        api.get("/properties"),
        api.get("/favourites"),
      ]);

      let fetchedProperties = propertiesResponse.data;

      if (!fetchedProperties.length) {
        await api.post("/properties", { seed: true });
        const seededResponse = await api.get("/properties");
        fetchedProperties = seededResponse.data;
      }

      setProperties(fetchedProperties);
      setFavourites(dedupeById(favouritesResponse.data || []));
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useLayoutEffect(() => {
    if (!properties.length) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".property-card",
        {
          y: 65,
          opacity: 0,
          scale: 0.94,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power4.out",
        }
      );
    }, pageRef);

    return () => {
      context.revert();
    };
  }, [properties.length]);

  const favouriteIdSet = useMemo(() => {
    return new Set(
      favourites
        .map((property) => getEntityId(property))
        .filter(Boolean)
    );
  }, [favourites]);

  const handleToggleFavourite = async (property) => {
    const propertyId = getEntityId(property);

    if (!propertyId) {
      showToast("Property ID missing. Please refresh listings.", "error");
      return;
    }

    if (pendingFavouriteIds.includes(propertyId)) {
      return;
    }

    const isFavourite = favouriteIdSet.has(propertyId);
    const previousFavourites = favourites;

    setPendingFavouriteIds((prev) => [...prev, propertyId]);
    setFavourites((prev) => {
      if (isFavourite) {
        return prev.filter((item) => getEntityId(item) !== propertyId);
      }

      return dedupeById([...prev, property]);
    });

    try {
      const response = isFavourite
        ? await api.delete(`/favourites/${propertyId}`)
        : await api.post(`/favourites/${propertyId}`);

      setFavourites(dedupeById(response.data.favourites || []));
      showToast(
        isFavourite ? "Removed from favourites." : "Added to favourites.",
        "success"
      );
    } catch (error) {
      setFavourites(previousFavourites);
      showToast(error.message, "error");
    } finally {
      setPendingFavouriteIds((prev) =>
        prev.filter((pendingId) => pendingId !== propertyId)
      );
    }
  };

  const handleLogout = () => {
    logout();
    showToast("Session closed.", "info");
    navigate("/login", { replace: true });
  };

  const handleHeroMouseMove = (event) => {
    if (!heroImages.length) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) {
      return;
    }

    const localX = event.clientX - rect.left;
    const segment = rect.width / heroImages.length;
    const nextIndex = Math.min(
      heroImages.length - 1,
      Math.max(0, Math.floor(localX / segment))
    );

    setActiveHeroIndex((current) => (current === nextIndex ? current : nextIndex));
  };

  return (
    <PageTransition>
      <div ref={pageRef} className="min-h-screen px-4 pb-14 md:px-8">
        <Navbar userName={user?.name || "Buyer"} onLogout={handleLogout} />

        <header
          data-animate="hero"
          className="relative mx-auto mt-8 max-w-7xl overflow-hidden rounded-3xl border border-darkline px-6 py-8 md:px-10 md:py-10"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={() => setActiveHeroIndex(0)}
        >
          <div className="images pointer-events-none absolute inset-0">
            {heroImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                  index === activeHeroIndex ? "scale-100 opacity-100" : "scale-105 opacity-0"
                }`}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.64)_45%,rgba(0,0,0,0.85)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(210,105,30,0.28)_0%,rgba(210,105,30,0.06)_36%,rgba(210,105,30,0)_58%)]" />

          <div className="relative z-10">
            <p data-animate="stagger" className="text-xs uppercase tracking-[0.3em] text-accent">
              {user?.name || "Buyer"}, your collection awaits
            </p>
            <h1
              data-animate="stagger"
              className="mt-3 max-w-3xl font-display text-4xl leading-tight text-white md:text-6xl"
            >
              Discover signature properties for decisive buyers.
            </h1>
            <p data-animate="stagger" className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80">
              Explore curated estates, animate through every detail, and build a private shortlist
              in your favourites vault.
            </p>

            <div data-animate="stagger" className="mt-7 flex flex-wrap gap-3">
              <RippleButton
                onClick={() => navigate("/favourites")}
                className="inline-flex items-center gap-2 rounded-full border border-accent/70 bg-accent/15 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white"
              >
                <Sparkles size={16} /> Open My Favourites
              </RippleButton>

              <RippleButton
                onClick={fetchData}
                className="rounded-full border border-darkline bg-card px-5 py-3 text-xs uppercase tracking-[0.2em] text-white/80"
              >
                Refresh Listings
              </RippleButton>
            </div>
          </div>
        </header>

        <main className="mx-auto mt-10 max-w-7xl">
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-3xl text-white">Featured Estates</h2>
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                {properties.length} Listings
              </p>
            </div>

            {loading ? (
              <div className="grid min-h-[360px] place-content-center rounded-2xl border border-darkline bg-card/50">
                <LuxurySpinner label="Loading properties" />
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => {
                  const propertyId = getEntityId(property);

                  return (
                    <PropertyCard
                      key={propertyId || property.title}
                      property={property}
                      isFavourite={propertyId ? favouriteIdSet.has(propertyId) : false}
                      isBusy={propertyId ? pendingFavouriteIds.includes(propertyId) : false}
                      onToggleFavourite={handleToggleFavourite}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </main>

        <SiteFooter />
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
