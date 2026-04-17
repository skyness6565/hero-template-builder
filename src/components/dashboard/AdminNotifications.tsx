import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Notif {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

const AdminNotifications = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);

  const load = async () => {
    if (!user) return;
    const { data: notifs } = await supabase
      .from("notifications")
      .select("id,title,message,created_at,target,target_user_id")
      .or(`target.eq.all,target_user_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(20);
    const { data: reads } = await supabase
      .from("notification_reads")
      .select("notification_id")
      .eq("user_id", user.id);
    const readIds = new Set((reads ?? []).map((r) => r.notification_id));
    setItems((notifs ?? []).filter((n) => !readIds.has(n.id)));
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("notif-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const dismiss = async (id: string) => {
    if (!user) return;
    setItems((prev) => prev.filter((n) => n.id !== id));
    await supabase.from("notification_reads").insert({ notification_id: id, user_id: user.id });
  };

  if (items.length === 0) return null;
  const current = items[0];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-card border-2 border-primary rounded-2xl shadow-2xl shadow-primary/30 p-6 md:p-8">
        <button
          onClick={() => dismiss(current.id)}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <Bell className="text-primary" size={22} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-xs uppercase tracking-wider text-primary font-bold mb-1">
              Important Notice
            </p>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground leading-tight">
              {current.title}
            </h2>
          </div>
        </div>

        <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed mb-6">
          {current.message}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {items.length > 1 ? `${items.length - 1} more notification${items.length - 1 > 1 ? "s" : ""}` : ""}
          </span>
          <button
            onClick={() => dismiss(current.id)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
