import { GraduationCap } from "lucide-react";

const AccountCard = () => (
  <div className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-primary/30 via-blue-600/20 to-primary/10 border border-primary/20">
    <div className="absolute -right-4 -top-4 opacity-10">
      <GraduationCap size={80} className="text-primary" />
    </div>
    <p className="text-xs text-muted-foreground mb-1">Account Type</p>
    <h3 className="font-heading font-semibold text-foreground text-sm mb-3">Demo Account Active</h3>
    <p className="text-2xl font-heading font-bold text-foreground">$100,000.00</p>
    <p className="text-xs text-muted-foreground mt-1">Available Balance</p>
  </div>
);

export default AccountCard;
