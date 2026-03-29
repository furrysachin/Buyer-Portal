import { useMemo, useState } from "react";
import { HeartOff, ImageOff, MapPin } from "lucide-react";
import RippleButton from "./RippleButton";
import { dedupeById, getEntityId } from "../utils/entityId";

const FavouriteThumbnail = ({ image, title }) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed || !image) {
    return (
      <div className="grid h-40 w-full shrink-0 place-content-center rounded-lg border border-darkline bg-black/60 sm:h-24 sm:w-28">
        <ImageOff size={16} className="text-white/45" />
      </div>
    );
  }

  return (
    <img
      src={image}
      alt=""
      onError={() => setImageFailed(true)}
      className="h-40 w-full shrink-0 rounded-lg object-cover sm:h-24 sm:w-28"
      loading="lazy"
      title={title}
    />
  );
};

const FavouritesPanel = ({ favourites, pendingIds = [], onRemove }) => {
  const uniqueFavourites = useMemo(() => dedupeById(favourites || []), [favourites]);

  return (
    <section className="overflow-hidden rounded-2xl border border-darkline bg-card/70 p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl text-white">My Favourites</h2>
        <p className="text-xs uppercase tracking-[0.24em] text-white/55">
          {uniqueFavourites.length} Saved
        </p>
      </div>

      {uniqueFavourites.length === 0 ? (
        <p className="rounded-xl border border-dashed border-darkline px-4 py-10 text-center text-sm text-white/55">
          No favourites yet. Save properties from the dashboard.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {uniqueFavourites.map((property) => {
            const propertyId = getEntityId(property);
            const isBusy = propertyId ? pendingIds.includes(propertyId) : false;

            return (
              <article
                key={propertyId || property.title}
                className="flex min-w-0 flex-col gap-3 overflow-hidden rounded-xl border border-darkline bg-black/60 p-3 sm:flex-row"
              >
                <FavouriteThumbnail image={property.image} title={property.title} />

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                  <div>
                    <h3 className="break-words font-display text-lg leading-tight text-white">
                      {property.title}
                    </h3>
                    <p className="mt-1 inline-flex max-w-full items-center gap-1 break-words text-xs uppercase tracking-[0.12em] text-white/60">
                      <MapPin size={12} className="text-accent" />
                      {property.location}
                    </p>
                  </div>

                  <RippleButton
                    disabled={isBusy || !propertyId}
                    onClick={() => onRemove(propertyId)}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full border border-darkline bg-card px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-white/85 sm:w-fit sm:justify-start ${
                      isBusy ? "cursor-not-allowed opacity-70" : ""
                    }`}
                  >
                    <HeartOff size={14} className="text-accent" /> Remove
                  </RippleButton>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FavouritesPanel;
