import type { Metadata } from "next";

/** Member, instructor, and admin app surfaces — keep out of organic search. */
export const PRIVATE_APP_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};
