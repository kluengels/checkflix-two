import { Locale } from "@/i18n/routing";

export function getMonthName(locale: Locale): string[] {
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString(locale, { month: "long" })
  );

  return monthNames;
}