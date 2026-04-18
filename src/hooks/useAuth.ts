"use client";

import { useState, useEffect, useCallback, useMemo, startTransition } from "react";
import { parseMemberJwtRole } from "@/lib/auth-flow";

export function useAuth() {
 const [token, setToken] = useState<string | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const stored = localStorage.getItem("token");
 startTransition(() => {
 setToken(stored);
 setLoading(false);
 });
 }, []);

 const role = useMemo(() => parseMemberJwtRole(token), [token]);

 const logout = useCallback(() => {
 localStorage.removeItem("token");
 setToken(null);
 }, []);

 const login = useCallback((newToken: string) => {
 localStorage.setItem("token", newToken);
 setToken(newToken);
 }, []);

 return {
 token,
 loading,
 isAuthenticated: !!token,
 /** From member JWT (`localStorage.token`); undefined if logged out or payload missing role. */
 role,
 login,
 logout,
 };
}
