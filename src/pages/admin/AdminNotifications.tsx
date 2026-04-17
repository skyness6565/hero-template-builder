import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import useAdmin from "@/hooks/useAdmin";
import { toast } from "@/hooks/use-toast";
import { Bell, Trash2, Send } from "lucide-react";

interface Notif {
  id: string;
  title: string;
  message: string;
  target: string;
  target_user_id: string | null;
  created_at: string;
}

const AdminNotificationsPage = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "user">("all");
  const [targetUserId, setTargetUserId] = useState("");
  const [items, setItems] = useState<Notif[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/dashboard");
  }, [isAdmin, loading, navigate]);

  const load = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setItems((data as Notif[]) ?? []);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !message.trim()) return;
    if (target === "user" && !targetUserId.trim()) {
      toast({ title: "User ID required", variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("notifications").insert({
      title: title.trim(),
      message: message.trim(),
      target,
      target_user_id: target === "user" ? targetUserId.trim() : null,
      created_by: user.id,
    });
    setSending(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Notification sent" });
    setTitle("");
    setMessage("");
    setTargetUserId("");
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    load();
  };

  if (loading) return null;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <Bell className="text-primary" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">Send announcements to users.</p>
          </div>
        </div>

        <form onSubmit={send} className="bg-card border border-border/30 rounded-lg p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              required
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Target</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as "all" | "user")}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All users</option>
                <option value="user">Specific user</option>
              </select>
            </div>
            {target === "user" && (
              <div>
                <label className="block text-sm font-medium mb-1">User ID</label>
                <input
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="UUID"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={sending}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <Send size={16} /> {sending ? "Sending..." : "Send Notification"}
          </button>
        </form>

        <div className="bg-card border border-border/30 rounded-lg p-5">
          <h2 className="font-semibold mb-3">Recent Notifications</h2>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            <div className="space-y-2">
              {items.map((n) => (
                <div key={n.id} className="border border-border/30 rounded-lg p-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{n.title}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{n.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {n.target === "all" ? "All users" : `User: ${n.target_user_id}`} ·{" "}
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => remove(n.id)} className="text-chart-red hover:opacity-80">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotificationsPage;
