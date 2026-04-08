import { useState } from "react";
import { Bell, X } from "lucide-react";

const NotificationBanner = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-notification/10 border border-notification/20 mx-4 mt-4 rounded-lg px-4 py-3 flex items-center gap-3 md:mx-6">
      <Bell size={18} className="text-notification-foreground shrink-0" />
      <p className="text-sm text-notification-foreground flex-1">
        Trading bots require you to{" "}
        <span className="text-chart-green font-medium">purchase new trading bots</span>
        {" "}to continue automated trading.
      </p>
      <button onClick={() => setVisible(false)} className="text-notification-foreground/60 hover:text-notification-foreground transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export default NotificationBanner;
