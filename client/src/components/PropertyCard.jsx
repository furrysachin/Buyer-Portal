import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Heart, HeartOff, MapPin } from "lucide-react";
import RippleButton from "./RippleButton";

const FALLBACK_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80";

const formatPrice = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const PropertyCard = ({ property, isFavourite, isBusy = false, onToggleFavourite }) => {
  const cardRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(property.image || FALLBACK_PROPERTY_IMAGE);

  useEffect(() => {
    setImageSrc(property.image || FALLBACK_PROPERTY_IMAGE);
  }, [property.image]);

  useLayoutEffect(() => {
    const card = cardRef.current;

    if (!card) {
      return undefined;
    }

    const handleMouseMove = (event) => {
      const rect = card.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((localX - centerX) / centerX) * 6;
      const rotateX = ((centerY - localY) / centerY) * 6;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 950,
        duration: 0.45,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleFavouriteClick = async (event) => {
    event?.stopPropagation?.();
    await onToggleFavourite(property);
  };

  return (
    <article
      ref={cardRef}
      className="property-card group overflow-hidden rounded-2xl border border-darkline bg-card shadow-card"
    >
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={property.title}
          onError={() => setImageSrc(FALLBACK_PROPERTY_IMAGE)}
          className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110 xl:h-72"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="mb-1 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-white/80">
            <MapPin size={14} className="text-accent" />
            {property.location}
          </p>
          <h3 className="font-display text-3xl text-white">{property.title}</h3>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <p className="text-base leading-relaxed text-white/75">{property.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="inline-flex items-center justify-center rounded-full border border-accent/45 bg-accent/12 px-5 py-3 text-center">
            <span className="font-display text-xl leading-none text-accent">
              {formatPrice(property.price)}
            </span>
          </div>

          <RippleButton
            onClick={handleFavouriteClick}
            disabled={isBusy}
            aria-label={isFavourite ? "Remove from favourites" : "Save to favourites"}
            aria-pressed={isFavourite}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-xs uppercase tracking-[0.16em] ${
              isFavourite
                ? "border-accent/70 bg-accent/12 text-white"
                : "border-darkline bg-black/50 text-white/90"
            } ${isBusy ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {isFavourite ? <HeartOff size={14} /> : <Heart size={14} />}
            {isFavourite ? "Unlike" : "Like"}
          </RippleButton>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
