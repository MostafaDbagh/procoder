"use client";

import { useEffect, useState } from "react";
import { hasAnySession } from "@/lib/session-idle";
import { useIdleSessionLogout } from "@/hooks/useIdleSessionLogout";

const POLL_MS = 15000;

/**
 * Logs out parent, student, instructor (member JWT) and admin after {@link SESSION_IDLE_MS} of no input.
 * Mount once per app shell (locale marketing + admin).
 */
export function SessionIdleGuard() {
 const [sessionActive, setSessionActive] = useState(false);

 useEffect(() => {
 const sync = () => setSessionActive(hasAnySession());
 sync();
 const id = window.setInterval(sync, POLL_MS);
 const onFocus = () => sync();
 const onVis = () => {
 if (document.visibilityState === "visible") sync();
 };
 window.addEventListener("focus", onFocus);
 document.addEventListener("visibilitychange", onVis);
 return () => {
 window.clearInterval(id);
 window.removeEventListener("focus", onFocus);
 document.removeEventListener("visibilitychange", onVis);
 };
 }, []);

 useIdleSessionLogout(sessionActive);

 return null;
}
