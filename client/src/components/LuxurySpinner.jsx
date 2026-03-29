import { LoaderCircle } from "lucide-react";

const LuxurySpinner = ({ label = "Loading" }) => {
  return (
    <div className="flex flex-col items-center gap-3 text-white/90">
      <div className="relative grid h-14 w-14 place-content-center rounded-full border border-accent/30">
        <LoaderCircle className="h-7 w-7 animate-spin text-accent" />
        <div className="absolute inset-0 rounded-full border border-accent/50 blur-[1px]" />
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</p>
    </div>
  );
};

export default LuxurySpinner;
