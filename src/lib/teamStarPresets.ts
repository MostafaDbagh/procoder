/** Avatar / about-card gradient classes (Tailwind must see these literals). */
export const TEAM_CARD_GRADIENTS = [
 { value: "from-blue-400 to-cyan-400", label: "Blue → cyan" },
 { value: "from-blue-400 to-primary", label: "Blue → primary" },
 { value: "from-purple to-violet-400", label: "Purple → violet" },
 { value: "from-emerald-400 to-teal-400", label: "Emerald → teal" },
 { value: "from-pink-400 to-rose-400", label: "Pink → rose" },
 { value: "from-amber-400 to-orange-400", label: "Amber → orange" },
 { value: "from-cyan-400 to-blue-400", label: "Cyan → blue" },
 { value: "from-teal-400 to-green-400", label: "Teal → green" },
 { value: "from-indigo-400 to-violet-400", label: "Indigo → violet" },
 { value: "from-fuchsia-400 to-purple-400", label: "Fuchsia → purple" },
] as const;

const GRAD_ALLOWED = new Set<string>(
 TEAM_CARD_GRADIENTS.map((g) => g.value)
);

export function resolveTeamCardGradient(raw: string | undefined | null): string {
 const s = String(raw || "").trim();
 if (s && GRAD_ALLOWED.has(s)) return s;
 return "from-blue-400 to-cyan-400";
}

/** Allowed header strip colors for Meet Our Stars (Tailwind must see these literals). */
export const TEAM_STAR_HEADER_COLORS = [
 { value: "bg-amber-400", label: "Amber" },
 { value: "bg-purple", label: "Purple" },
 { value: "bg-blue-500", label: "Blue" },
 { value: "bg-rose-400", label: "Rose" },
 { value: "bg-emerald-500", label: "Emerald" },
 { value: "bg-teal-500", label: "Teal" },
 { value: "bg-primary", label: "Primary" },
 { value: "bg-cyan-500", label: "Cyan" },
 { value: "bg-orange", label: "Orange" },
] as const;

const ALLOWED = new Set<string>(TEAM_STAR_HEADER_COLORS.map((o) => o.value));

export function resolveTeamStarHeaderColor(raw: string | undefined | null): string {
 const s = String(raw || "").trim();
 if (s && ALLOWED.has(s)) return s;
 return "bg-primary";
}
