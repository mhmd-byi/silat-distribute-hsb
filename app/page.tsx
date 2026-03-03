"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef } from "react";
import {
  Search, LogOut, LayoutGrid, User, ShieldCheck, Loader2, X, Check,
} from "lucide-react";

function CheckIcon() {
  return <Check className="size-3" />;
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Mumineen {
  id: string;
  sector: string;
  subSector: string;
  masool: string;
  musaeed: string;
  sabil: string | number;
  itsId: string | number;
  name: string;
  shortAddress: string;
  mobileNo: string;
  silatGiven: boolean;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [inputValue, setInputValue] = useState("");
  const [searchedSabil, setSearchedSabil] = useState("");
  const [rows, setRows] = useState<Mumineen[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [givingId, setGivingId] = useState<string | null>(null); // row being updated
  const inputRef = useRef<HTMLInputElement>(null);

  async function doSearch(sabilVal: string) {
    const val = sabilVal.trim();
    if (!val) return;
    setSearchedSabil(val);
    setHasSearched(true);
    setLoading(true);
    setError("");
    setRows([]);

    try {
      const res = await fetch(`/api/mumineen?sabil=${encodeURIComponent(val)}&limit=200`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setRows(json.data);
      setTotal(json.total);
    } catch {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") doSearch(inputValue);
  }

  // Mark a single mumineen as silat given
  async function markAsGiven(id: string) {
    setGivingId(id);
    try {
      const res = await fetch(`/api/mumineen/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
      // Optimistic update — flip the flag locally
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, silatGiven: true } : r))
      );
    } catch {
      // silent — user can retry
    } finally {
      setGivingId(null);
    }
  }

  function handleClear() {
    setInputValue("");
    setSearchedSabil("");
    setHasSearched(false);
    setRows([]);
    setTotal(0);
    setError("");
    inputRef.current?.focus();
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside className="
        hidden md:flex flex-col w-56 shrink-0
        bg-card border-r border-border
        sticky top-0 h-screen
      ">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="size-4 text-white" />
          </div>
          <span className="font-bold text-foreground text-sm tracking-tight">HSB Portal</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem icon={<LayoutGrid className="size-4" />} label="Mumineen" active />
          <NavItem icon={<User className="size-4" />} label="Profile" />
        </nav>

        {/* User footer */}
        <div className="border-t border-border px-3 py-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              {(session?.user?.name ?? "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <Button
              id="signout-btn"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-destructive shrink-0"
              title="Sign out"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="size-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="
          sticky top-0 z-20 bg-card/80 backdrop-blur-sm
          border-b border-border
          flex items-center justify-between gap-4
          px-6 py-3.5
        ">
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">
              Mumineen Directory
            </h1>
            {hasSearched && !loading && (
              <p className="text-xs text-muted-foreground mt-0.5 animate-in fade-in duration-200">
                {total === 0
                  ? `No results for Sabil "${searchedSabil}"`
                  : `${total} member${total !== 1 ? "s" : ""} in Sabil ${searchedSabil}`}
              </p>
            )}
          </div>

          {/* Search bar (appears in header after first search) */}
          {hasSearched && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  id="sabil-search-header"
                  type="number"
                  placeholder="Sabil number…"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-8 pr-7 h-8 w-44 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {inputValue && (
                  <button
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
              <Button
                id="search-btn-header"
                size="sm"
                className="h-8 text-xs px-3"
                onClick={() => doSearch(inputValue)}
                disabled={loading || !inputValue.trim()}
              >
                {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Search"}
              </Button>
            </div>
          )}
        </header>

        {/* ── Hero (initial state) ─────────────────────────────── */}
        {!hasSearched && (
          <div className="flex-1 flex items-center justify-center p-8">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="relative text-center max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Icon */}
              <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Search className="size-6 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
                Search by Sabil
              </h2>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Enter a Sabil number to view all members in that Sabil group
              </p>

              {/* Search input row */}
              <div className="flex items-center gap-2 max-w-sm mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    id="sabil-search-hero"
                    type="number"
                    placeholder="e.g. 2"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="pl-9 h-11 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <Button
                  id="search-btn-hero"
                  className="h-11 px-5 text-sm font-semibold"
                  onClick={() => doSearch(inputValue)}
                  disabled={loading || !inputValue.trim()}
                >
                  {loading
                    ? <Loader2 className="size-4 animate-spin" />
                    : "Search"}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted border border-border rounded">Enter</kbd> to search
              </p>
            </div>
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────── */}
        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between">
            <span>⚠ {error}</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => doSearch(searchedSabil)}>
              Retry
            </Button>
          </div>
        )}

        {/* ── Loading ─────────────────────────────────────────── */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm">Looking up Sabil {searchedSabil}…</p>
          </div>
        )}

        {/* ── No results ──────────────────────────────────────── */}
        {hasSearched && !loading && !error && rows.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8 animate-in fade-in duration-200">
            <div className="text-4xl">🔍</div>
            <p className="font-semibold text-foreground">No results for Sabil <strong>{searchedSabil}</strong></p>
            <p className="text-sm text-muted-foreground">Try a different number</p>
            <Button variant="outline" size="sm" onClick={handleClear} className="mt-1">
              Clear search
            </Button>
          </div>
        )}

        {/* ── Table ───────────────────────────────────────────── */}
        {hasSearched && !loading && rows.length > 0 && (
          <div className="flex-1 overflow-auto px-6 py-4 animate-in fade-in duration-200">
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-10 text-muted-foreground text-xs font-semibold">#</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">ITS ID</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">Name</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">Sector</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">Sub-Sector</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">Masool</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">Musaeed</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">Address</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">Mobile</TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={r.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-primary">{r.itsId || "—"}</TableCell>
                      <TableCell className="font-medium text-foreground max-w-[200px] truncate">{r.name || "—"}</TableCell>
                      <TableCell>
                        {r.sector
                          ? <Badge variant="secondary" className="text-primary bg-primary/10 border-primary/20 font-semibold text-xs">{r.sector}</Badge>
                          : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{r.subSector || "—"}</TableCell>
                      <TableCell className={cn("text-xs max-w-[160px] truncate", r.masool ? "text-foreground/70" : "text-muted-foreground")}>
                        {r.masool || "—"}
                      </TableCell>
                      <TableCell className={cn("text-xs max-w-[160px] truncate", r.musaeed ? "text-foreground/70" : "text-muted-foreground")}>
                        {r.musaeed || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[140px] truncate">{r.shortAddress || "—"}</TableCell>
                      <TableCell className="font-mono text-xs text-sky-600">
                        {String(r.mobileNo) !== "" && String(r.mobileNo) !== "[object Object]"
                          ? String(r.mobileNo)
                          : "—"}
                      </TableCell>

                      {/* ── Action ── */}
                      <TableCell>
                        {r.silatGiven ? (
                          <Badge
                            className="bg-green-50 text-green-700 border-green-200 font-semibold text-xs gap-1"
                            variant="outline"
                          >
                            <CheckIcon />
                            Given
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            className="h-7 text-xs px-3 font-semibold"
                            disabled={givingId === r.id}
                            onClick={() => markAsGiven(r.id)}
                          >
                            {givingId === r.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : null}
                            Silat Given
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </a>
  );
}
