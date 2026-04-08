import { useAuth } from "@/contexts/AuthContext";

const WelcomeSection = () => {
  const { user } = useAuth();
  const name = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Trader";

  return (
    <div className="px-4 pt-6 pb-2 md:px-6">
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
        Welcome back, <span className="text-primary">{name}</span>!
      </h1>
      <p className="text-muted-foreground text-sm mt-1">Your investment dashboard overview</p>
    </div>
  );
};

export default WelcomeSection;
