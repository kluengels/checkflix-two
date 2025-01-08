import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "de"],

  // Used when no locale matches
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/dashboard": {
      en: "/dashboard",
      de: "/uebersicht",
    },
    "/imprint": {
      en: "/imprint",
      de: "/impressum",
    },
    "/movies": {
      en: "/movies",
      de: "/filme",
    },
    "/series": {
      en: "/tv-shows",
      de: "/serien",
    },

    "/upload": {
      en: "/upload/",
      de: "/upload/",
    },
    "/contact": {
      en: "/contact",
      de: "/kontakt",
    },

    "/privacy": {
      en: "/privacy-policy",
      de: "/datenschutz",
    },
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;

export const pathNamesWithStorage = [
  "upload",
  "dashboard",
  "movies",
  "series",
] as const;
export type PathnamesWithStorage = typeof pathNamesWithStorage;

export const pathNamesWithoutStorage = ["upload"] as const;
export type PathNamesWithoutStorage = typeof pathNamesWithoutStorage;
