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

  return (
    <div className="space-y-2">
      {items.map((n) => (
        <div
          key={n.id}
          className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 flex items-start gap-3"
        >
          <Bell size={18} className="text-primary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{n.title}</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{n.message}</p>
          </div>
          <button
            onClick={() => dismiss(n.id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminNotifications;
