import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import useAdmin from "@/hooks/useAdmin";
import { toast } from "@/hooks/use-toast";
import { Bell, Trash2, Send, Search, Check, ChevronDown } from "lucide-react";

interface Notif {
  id: string;
  title: string;
  message: string;
  target: string;
  target_user_id: string | null;
  created_at: string;
}

interface AppUser {
  id: string;
  email: string;
  display_name: string | null;
}

const AdminNotificationsPage = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "user">("all");
  const [items, setItems] = useState<Notif[]>([]);
  const [sending, setSending] = useState(false);

  const [users, setUsers] = useState<AppUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState<AppUser | null>(null);

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

  const loadUsers = async () => {
    setUsersLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-list-users");
    setUsersLoading(false);
    if (error) {
      toast({ title: "Failed to load users", description: error.message, variant: "destructive" });
      return;
    }
    setUsers((data as { users: AppUser[] })?.users ?? []);
  };

  useEffect(() => {
    if (isAdmin) {
      load();
      loadUsers();
    }
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users.slice(0, 50);
    return users
      .filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          (u.display_name ?? "").toLowerCase().includes(q),
      )
      .slice(0, 50);
  }, [users, search]);

  const userEmailById = useMemo(() => {
    const m = new Map<string, string>();
    users.forEach((u) => m.set(u.id, u.email));
    return m;
  }, [users]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !message.trim()) return;
    if (target === "user" && !selected) {
      toast({ title: "Select a user", variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("notifications").insert({
      title: title.trim(),
      message: message.trim(),
      target,
      target_user_id: target === "user" ? selected!.id : null,
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
    setSelected(null);
    setSearch("");
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
                onChange={(e) => {
                  setTarget(e.target.value as "all" | "user");
                  setSelected(null);
                }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All users</option>
                <option value="user">Specific user</option>
              </select>
            </div>
            {target === "user" && (
              <div className="relative">
                <label className="block text-sm font-medium mb-1">User</label>
                <button
                  type="button"
                  onClick={() => setPickerOpen((o) => !o)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm flex items-center justify-between"
                >
                  <span className={selected ? "text-foreground truncate" : "text-muted-foreground"}>
                    {selected ? selected.email : usersLoading ? "Loading users..." : "Select a user"}
                  </span>
                  <ChevronDown size={14} className="text-muted-foreground shrink-0 ml-2" />
                </button>
                {pickerOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setPickerOpen(false)} />
                    <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-2xl z-40 overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30">
                        <Search size={14} className="text-muted-foreground" />
                        <input
                          autoFocus
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search by email or name..."
                          className="flex-1 bg-transparent text-sm outline-none"
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {usersLoading ? (
                          <div className="px-3 py-4 text-sm text-muted-foreground">Loading...</div>
                        ) : filtered.length === 0 ? (
                          <div className="px-3 py-4 text-sm text-muted-foreground">No users found.</div>
                        ) : (
                          filtered.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => {
                                setSelected(u);
                                setPickerOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted/40 flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <p className="text-foreground truncate">{u.email}</p>
                                {u.display_name && (
                                  <p className="text-xs text-muted-foreground truncate">{u.display_name}</p>
                                )}
                              </div>
                              {selected?.id === u.id && <Check size={14} className="text-primary shrink-0" />}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
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
                      {n.target === "all"
                        ? "All users"
                        : `User: ${userEmailById.get(n.target_user_id ?? "") ?? n.target_user_id}`}{" "}
                      · {new Date(n.created_at).toLocaleString()}
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
