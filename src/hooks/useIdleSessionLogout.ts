"use client";

import { useEffect, useRef, useCallback } from "react";
import {
 SESSION_IDLE_MS,
 hasAnySession,
 clearAllSessionTokens,
 redirectAfterIdleLogout,
} from "@/lib/session-idle";

/**
 * Resets a single timer on user activity (throttled). When it fires, clears tokens and redirects.
 */
export function useIdleSessionLogout(enabled: boolean) {
 const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 const armTimer = useCallback(() => {
 if (!enabled || !hasAnySession()) {
 if (timerRef.current) {
 clearTimeout(timerRef.current);
 timerRef.current = null;
 }
 return;
 }
 if (timerRef.current) clearTimeout(timerRef.current);
 timerRef.current = setTimeout(() => {
 if (!hasAnySession()) return;
 clearAllSessionTokens();
 redirectAfterIdleLogout();
 }, SESSION_IDLE_MS);
 }, [enabled]);

 useEffect(() => {
 if (!enabled) {
 if (timerRef.current) {
 clearTimeout(timerRef.current);
 timerRef.current = null;
 }
 return;
 }

 armTimer();

 const throttleMs = 1000;
 let lastFire = 0;
 const onActivity = () => {
 const now = Date.now();
 if (now - lastFire < throttleMs) return;
 lastFire = now;
 armTimer();
 };

 const opts: AddEventListenerOptions = { passive: true };
 window.addEventListener("mousedown", onActivity, opts);
 window.addEventListener("keydown", onActivity);
 window.addEventListener("touchstart", onActivity, opts);
 window.addEventListener("scroll", onActivity, opts);
 window.addEventListener("mousemove", onActivity, opts);

 return () => {
 window.removeEventListener("mousedown", onActivity);
 window.removeEventListener("keydown", onActivity);
 window.removeEventListener("touchstart", onActivity);
 window.removeEventListener("scroll", onActivity);
 window.removeEventListener("mousemove", onActivity);
 if (timerRef.current) {
 clearTimeout(timerRef.current);
 timerRef.current = null;
 }
 };
 }, [enabled, armTimer]);
}
