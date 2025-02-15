import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { LANGS } from "./app-constants";

export const locales = [LANGS.en, LANGS.ar] as const;

export const routing = defineRouting({
  locales: locales,
  localePrefix: "always",
  defaultLocale: LANGS.en,
  localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
