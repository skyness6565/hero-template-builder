import { ShoppingCart } from "lucide-react";

const SubscriptionBanner = () => (
  <div className="glass-card rounded-xl p-4 flex items-center gap-4">
    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
      <ShoppingCart size={20} className="text-primary" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">Subscription</p>
      <p className="text-sm font-heading font-semibold text-foreground">Not subscribed</p>
    </div>
  </div>
);

export default SubscriptionBanner;
