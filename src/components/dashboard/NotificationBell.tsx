import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Notif {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = async () => {
    if (!user) return;
    const { data: notifs } = await supabase
      .from("notifications")
      .select("id,title,message,created_at,target,target_user_id")
      .or(`target.eq.all,target_user_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(30);
    const { data: reads } = await supabase
      .from("notification_reads")
      .select("notification_id")
      .eq("user_id", user.id);
    setReadIds(new Set((reads ?? []).map((r) => r.notification_id)));
    setItems((notifs ?? []) as Notif[]);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("notif-bell-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = items.filter((n) => !readIds.has(n.id)).length;

  const markRead = async (id: string) => {
    if (!user || readIds.has(id)) return;
    setReadIds((prev) => new Set(prev).add(id));
    await supabase.from("notification_reads").insert({ notification_id: id, user_id: user.id });
  };

  const markAllRead = async () => {
    if (!user) return;
    const unread = items.filter((n) => !readIds.has(n.id));
    if (unread.length === 0) return;
    setReadIds((prev) => {
      const s = new Set(prev);
      unread.forEach((n) => s.add(n.id));
      return s;
    });
    await supabase
      .from("notification_reads")
      .insert(unread.map((n) => ({ notification_id: n.id, user_id: user.id })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative h-9 w-9 rounded-lg bg-muted/50 border border-border/30 flex items-center justify-center hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} className="text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-chart-red text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-card rounded-xl border border-border/50 shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              items.map((n) => {
                const unread = !readIds.has(n.id);
                return (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`w-full text-left px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-colors ${
                      unread ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {unread && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 whitespace-pre-wrap">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                          {new Date(n.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
