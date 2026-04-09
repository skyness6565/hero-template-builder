import { CheckCircle2 } from "lucide-react";

const VerificationBanner = () => (
  <div className="glass-card rounded-xl p-4 flex items-center gap-3">
    <CheckCircle2 size={20} className="text-chart-green" />
    <div>
      <p className="text-sm font-medium text-chart-green">Verification Pending</p>
      <button className="text-xs text-primary underline hover:text-primary/80 transition-colors">
        Complete KYC
      </button>
    </div>
  </div>
);

export default VerificationBanner;
