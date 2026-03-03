"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface UserContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  refresh: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, loading, refresh: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

/** Call this to log out — clears cookie and redirects to /login */
export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
}
