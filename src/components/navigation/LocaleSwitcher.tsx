// Commented parts are preperations for the use of a consent banner

"use client";
import { useLocale, useTranslations } from "next-intl";
import { Locale, useRouter, usePathname } from "@/i18n/routing";
import React, { useState, useTransition, forwardRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { BiGlobe } from "react-icons/bi";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import {deleteCookieConsent} from '@/utils/cookieConsent';

// render flag icon based on locale
const FlagIcon = ({ locale }: { locale: Locale }) => {
  switch (locale) {
    case "en":
      return (
        <Image
          src="/flags/us.svg"
          width={10}
          height={10}
          alt="US flag"
          className="h-2 w-auto"
        />
      );
    case "de":
      return (
        <Image
          src="/flags/de.svg"
          width={10}
          height={10}
          alt="German flag"
          className="h-2 w-auto"
        />
      );
  }
};

interface LocaleSwitcherProps {
  variant?: "sheet" | "navbar" | "consent";
  className?: string;
}


/**
 *  Render language switcher with flags and language name
 */

const LocaleSwitcher = forwardRef<HTMLDivElement, LocaleSwitcherProps>(
  ({ variant = "sheet", className }, ref) => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const t = useTranslations("Navigation.navtexts");

    const [selectedLocale, setSelectedLocale] = useState<Locale>(
      locale as Locale,
    );

    const [isPending, startTransition] = useTransition();

    function onSelectChange(value: Locale) {
      // const pathnameWithSearchParams = `${pathname}?${searchParams}`;
      const nextLocale = value as Locale;

      setSelectedLocale(nextLocale);

      // if (variant === 'consent') {
      //   // delete the cookie consent cookie when changing the locale
      //   deleteCookieConsent();
      // }

      startTransition(() => {
        router.replace(
          // @ts-expect-error -- TypeScript will validate that only known `params`
          // are used in combination with a given `pathname`. Since the two will
          // always match for the current route, we can skip runtime checks.
          { pathname, params },
          { locale: nextLocale },
        );
      });
    }

    const locales = ["en", "de"] as const;

    return (
      <div
        ref={ref}
        className={cn(className, {
          "w-full": variant === "sheet",
        })}
      >
        <Select onValueChange={onSelectChange} value={selectedLocale}>
          <SelectTrigger
            className={cn("w-full bg-inherit", {
              "border-none focus:shadow-none focus:outline-none":
                variant === "navbar" || variant === "consent",
            })}
            aria-label="Language"
          >
            <SelectValue
              placeholder={variant === "sheet" ? t("selectLanguage") : ""}
            >
              <div className="flex items-center">
                <BiGlobe className="h-4 w-4 opacity-80" />
                <span className="ml-2">
                  {/* Sheet: Render full language name based on selected locale */}
                  {variant === "sheet" &&
                    (selectedLocale
                      ? `${t("language")}: ${selectedLocale === "de" ? t("german") : t("english")}`
                      : t("selectLanguage"))}

                  {/* Navbar: Render short language name based on selected locale */}
                  {variant === "navbar" &&
                    (selectedLocale
                      ? selectedLocale === "de"
                        ? "DE"
                        : "EN"
                      : "")}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-full min-w-[8rem] bg-background shadow-none">
            <SelectGroup>
              {locales.map((locale) => (
                <SelectItem
                  value={locale.toString()}
                  key={locale.toString()}
                  className="w-full"
                  disabled={isPending}
                >
                  <div className="flex items-center">
                    <FlagIcon locale={locale} />
                    <span className="ml-2">
                      {locale === "de" ? "Deutsch" : "English"}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  },
);

LocaleSwitcher.displayName = "LocaleSwitcher";
export default LocaleSwitcher;
