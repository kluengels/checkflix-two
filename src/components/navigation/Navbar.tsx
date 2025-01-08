"use client";
import React, { useEffect, useState } from "react";
import { useData } from "@/context/DataProvider";
import {
  Link,
  pathNamesWithStorage,
  PathNamesWithoutStorage,
  pathNamesWithoutStorage,
  PathnamesWithStorage,
} from "@/i18n/routing";
import { useTranslations } from "next-intl";
import NavigationLink from "./NavigationLink";

import { BiMenu, BiX } from "react-icons/bi";

import { checkStorage, cn } from "@/lib/utils";
import LocaleSwitcher from "./LocaleSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

/**
 * Responsive Navbar for app with navigation links (depends on storage status), locale switcher and theme switcher
 */
function Navbar() {
  const t = useTranslations("Navigation");
  const [navItems, setNavItems] = useState<
    PathNamesWithoutStorage | PathnamesWithStorage
  >(pathNamesWithoutStorage);
  const { hasStorageData, setHasStorageData } = useData();

  // Check if there is data in the storage, if so, show full menu
  useEffect(() => {
    const validateStorage = async () => {
      if (hasStorageData) {
        // validate that is there is indeed Storage Data
        const storageValidated = await checkStorage();
        if (storageValidated) {
          setNavItems(pathNamesWithStorage);
        } else {
          setHasStorageData(false);
        }
      }
    };
    validateStorage();
  }, [hasStorageData, setHasStorageData]);

  // open and close menu
  const [open, setOpen] = useState(false);
  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <>
      <nav
        className={cn(
          "flex max-h-20 min-h-20 items-center justify-center border-b-2 border-b-muted",
          { "border-b-0 md:border-b-2": open },
        )}
      >
        <div className="container mx-auto h-full max-w-[1800px] md:flex md:justify-between md:gap-2">
          <div className="relative ml-2 flex items-center justify-between md:justify-normal">
            {/* logo  */}
            <Link href="/" className="flex items-center justify-center gap-1">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-display text-3xl text-transparent">
                Checkflix
              </span>
            </Link>

            {/* Toggle Menu Button - Icon will switch depending on state */}
            <button
              onClick={toggleMenu}
              className="visible px-3 py-1 md:invisible"
              aria-label="Toggle Menu"
            >
              {open ? (
                <BiX className="block h-8 w-8 text-decorative md:invisible" />
              ) : (
                <BiMenu className="block h-8 w-8 text-decorative md:invisible" />
              )}
            </button>
          </div>

          <div
            className={cn(
              "absolute left-auto right-auto top-20 z-10 flex w-full flex-col items-center border-b bg-background pr-2 md:static md:w-fit md:flex-row md:border-b-0 md:pb-0",
              { "border-b-0": !open },
            )}
          >
            {/* Navigation Links*/}
            <ul
              onClick={() => {
                if (open) {
                  setOpen(false);
                }
              }}
              className={cn(
                "flex w-full flex-col items-center gap-4 p-4 font-semibold duration-1000 animate-in slide-in-from-top-16 md:animate-none md:flex-row md:gap-0",
                { "hidden md:flex": !open },
              )}
            >
              {navItems.map((pathname) => {
                const key = pathname;
                return (
                  <li key={key} className="">
                    <NavigationLink href={`/${pathname}`} className="">
                      {t(pathname)}
                    </NavigationLink>
                  </li>
                );
              })}
            </ul>

            {/* Locale Switcher and Theme Switcher */}
            <ul
              className={cn(
                "flex items-center justify-center gap-1 border-t px-20 pb-4 pt-2 md:border-none md:px-0 md:pb-0 md:pt-0 md:shadow-none",
                { "hidden md:flex": !open },
              )}
            >
              <li>
                <LocaleSwitcher variant="navbar" className="" />
              </li>
              <li>
                <ThemeSwitcher />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
