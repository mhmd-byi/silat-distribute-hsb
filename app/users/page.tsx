"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  ShieldCheck, LayoutGrid, User, LogOut,
  Loader2, Trash2, UserPlus, Eye, EyeOff,
  ShieldAlert, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserRow {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  createdAt: string | null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Create form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const isAdmin = session?.user?.role === "admin";

  // Fetch users
  async function fetchUsers() {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setUsers(json.data);
    } catch {
      // silent
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated" && isAdmin) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isAdmin]);

  // Create user
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setCreating(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setFormError(json.error ?? "Failed to create user");
        return;
      }
      setFormSuccess(`User "${form.username}" created successfully!`);
      setForm({ username: "", email: "", password: "", role: "user" });
      setShowForm(false);
      fetchUsers();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  // Delete user
  async function handleDelete(id: string, username: string) {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Failed to delete user");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Access denied for non-admins
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <ShieldAlert className="size-12 text-destructive mx-auto" />
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground text-sm">You need admin permissions to view this page.</p>
          <Button variant="outline" size="sm" asChild>
            <a href="/">← Back to Dashboard</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-card border-r border-border sticky top-0 h-screen">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="size-4 text-white" />
          </div>
          <span className="font-bold text-foreground text-sm tracking-tight">HSB Portal</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <a href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <LayoutGrid className="size-4" /> Mumineen
          </a>
          <a href="/users" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary transition-colors">
            <Users className="size-4" /> Users
          </a>
        </nav>

        <div className="border-t border-border px-3 py-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              {(session?.user?.name ?? "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{session?.user?.role}</p>
            </div>
            <Button
              variant="ghost" size="icon"
              className="size-7 text-muted-foreground hover:text-destructive shrink-0"
              title="Sign out"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="size-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 py-3.5">
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">User Management</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{users.length} user{users.length !== 1 ? "s" : ""}</p>
          </div>
          <Button
            id="create-user-btn"
            size="sm"
            className="gap-1.5"
            onClick={() => { setShowForm((v) => !v); setFormError(""); setFormSuccess(""); }}
          >
            <UserPlus className="size-3.5" />
            {showForm ? "Cancel" : "Create User"}
          </Button>
        </header>

        <div className="flex-1 p-6 space-y-5">

          {/* ── Success banner ── */}
          {formSuccess && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 animate-in fade-in duration-200 flex items-center justify-between">
              <span>✓ {formSuccess}</span>
              <button onClick={() => setFormSuccess("")} className="text-green-500 hover:text-green-700">✕</button>
            </div>
          )}

          {/* ── Create User Form ── */}
          {showForm && (
            <Card className="animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">New User</CardTitle>
                <CardDescription className="text-xs">Fill in the details to create a new portal user</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Username</label>
                    <Input
                      id="new-username"
                      placeholder="e.g. 12345678"
                      value={form.username}
                      onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                      required
                      className="h-9 text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Email</label>
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="user@example.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                      className="h-9 text-sm"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Password</label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Strong password"
                        value={form.password}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        required
                        className="h-9 text-sm pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Role</label>
                    <select
                      id="new-role"
                      value={form.role}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                      className={cn(
                        "w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
                        "text-foreground"
                      )}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Error */}
                  {formError && (
                    <div className="sm:col-span-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
                      ⚠ {formError}
                    </div>
                  )}

                  {/* Submit */}
                  <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => { setShowForm(false); setFormError(""); }}
                    >
                      Cancel
                    </Button>
                    <Button id="submit-create-user" type="submit" size="sm" disabled={creating} className="gap-1.5">
                      {creating ? <Loader2 className="size-3.5 animate-spin" /> : <UserPlus className="size-3.5" />}
                      Create User
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* ── Users Table ── */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs font-semibold text-muted-foreground">#</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Username</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Email</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Role</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Created</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      <Loader2 className="size-5 animate-spin text-primary mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u, i) => (
                    <TableRow key={u.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                      <TableCell className="font-semibold text-sm text-foreground">{u.username}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                      <TableCell>
                        {u.role === "admin" ? (
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold gap-1" variant="outline">
                            <ShieldCheck className="size-3" /> Admin
                          </Badge>
                        ) : (
                          <Badge className="bg-muted text-muted-foreground border-border text-xs font-semibold gap-1" variant="outline">
                            <User className="size-3" /> User
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {u.id === session?.user?.id ? (
                          <span className="text-xs text-muted-foreground italic">You</span>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                            disabled={deletingId === u.id}
                            onClick={() => handleDelete(u.id, u.username)}
                          >
                            {deletingId === u.id
                              ? <Loader2 className="size-3.5 animate-spin" />
                              : <Trash2 className="size-3.5" />}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

        </div>
      </div>
    </div>
  );
}
