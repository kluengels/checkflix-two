"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import {
  CookieConsent,
  Services,
  services,
  categories as categoriesFromConfig,
} from "@/config/cookieConsent.config";
import { getCookieConsent, setCookieConsent } from "@/utils/cookieConsent";
import CookieDetails from "./CookieDetails";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Checkbox } from "../ui/checkbox";
import { Link } from "@/i18n/routing";
import LocaleSwitcher from "../navigation/LocaleSwitcher";

interface CookieConsentBannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CookieConsentBanner({
  open,
  onOpenChange,
}: CookieConsentBannerProps) {
  const t = useTranslations("cookieConsent");
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({} as CookieConsent);

  const handleShowSettings = () => setShowSettings(true);

  // Reset showSettings when banner closes
  useEffect(() => {
    if (!open) {
      setShowSettings(false);
    }
  }, [open]);

  const handleAcceptAll = () => {
    // loop through all categories and enable them
    categoriesFromConfig.forEach((category) => {
      const newConsent = { ...consent };
      // enable category
      if (category) {
        if (newConsent[category]) {
          newConsent[category].enabled = true;
          setCookieConsent(newConsent, category);
        }
      }
    });
    onOpenChange(false);
  };

  const handleRejectAll = () => {
    // loop through all categories and disable them
    categoriesFromConfig.forEach((category) => {
      const newConsent = { ...consent };
      // disable category
      if (category && category !== "necessary") {
        if (newConsent[category as keyof CookieConsent]) {
          newConsent[category as keyof CookieConsent].enabled = false;
          setCookieConsent(newConsent, category);
        }
      }
    });
    onOpenChange(false);
  };

  const toggleCategory = (category: keyof Omit<CookieConsent, "necessary">) => {
    const newConsent = { ...consent };
    if (newConsent[category]) {
      // toggle consent
      const categoryConsent = newConsent[category] as {
        enabled: boolean;
        services: Record<string, boolean>;
      };
      categoryConsent.enabled = !categoryConsent.enabled;
    }
    setConsent(newConsent);
    setCookieConsent(newConsent, category);
  };

  const toggleService = (
    category: keyof Omit<CookieConsent, "necessary">,
    service: string,
  ) => {
    const newConsent = { ...consent };

    const categoryConsent = newConsent[category] as {
      enabled: boolean;
      services: Record<string, boolean>;
    };
    if (categoryConsent && "services" in categoryConsent) {
      categoryConsent.services[service] = !categoryConsent.services[service];
      setConsent(newConsent);
      setCookieConsent(
        newConsent,
        category,
        service,
        categoryConsent.services[service],
      );
    }
  };

  const handleConfirmSelection = () => {
    setShowSettings(false);
    onOpenChange(false);
  };

  // Initialize consent from cookies when component mounts
  useEffect(() => {
    const initConsent = async () => {
      const cookieConsent = await getCookieConsent();
      setConsent(cookieConsent);
    };
    initConsent();
  }, []);

  // console.log('consent', consent);
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogOverlay className="z-[3000] bg-black/30" />
        <DialogContent className="z-[3500] max-h-[100dvh] max-w-full overflow-y-auto bg-white text-black sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle asChild>
              <div className="flex items-center justify-between gap-2">
                <div className="text-left text-base font-bold sm:text-2xl">
                  {showSettings ? t("settingsHeader") : t("startHeader")}
                </div>
                {!showSettings && (
                  <LocaleSwitcher
                    variant="consent"
                    className="relative z-[4000]"
                  />
                )}
              </div>
            </DialogTitle>
            <DialogDescription className="mb-4 text-left text-sm text-gray-900">
              <>
                <span>{showSettings ? t("settingsInfo") : t("startInfo")}</span>
              </>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Link
              href="/imprint"
              onClick={() => onOpenChange(false)}
              className="text-xs hover:underline"
            >
              {t("imprint")}
            </Link>
            <Link
              href="/privacy"
              onClick={() => onOpenChange(false)}
              className="text-xs hover:underline"
            >
              {t("privacy")}
            </Link>
          </div>
          {!showSettings && (
            <>
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-sm sm:text-base"
                  onClick={handleShowSettings}
                >
                  {t("customize")}
                </Button>
                <Button
                  variant="default"
                  className="w-full text-sm sm:text-base"
                  onClick={handleRejectAll}
                >
                  {t("rejectAll")}
                </Button>
                <Button
                  className="w-full text-sm sm:text-base"
                  onClick={handleAcceptAll}
                >
                  {t("acceptAll")}
                </Button>
              </div>
            </>
          )}
          {showSettings && (
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full grid-cols-2 text-xs sm:text-sm">
                <TabsTrigger value="categories">{t("categories")}</TabsTrigger>
                <TabsTrigger value="services">{t("services")}</TabsTrigger>
              </TabsList>
              <TabsContent value="categories">
                <ScrollArea className="h-[30vh] border p-4">
                  <div className="space-y-4">
                    {Object.entries(consent).map(
                      ([category, categoryConsent]) => {
                        // check if category is empty
                        const categoryEmpty =
                          categoryConsent.services &&
                          Object.keys(categoryConsent.services).length == 0;

                        return (
                          <div key={category} className="ml-4">
                            <div className="flex items-center justify-between">
                              <h5 className="text-base">
                                {t(`${category}.name`)}
                              </h5>
                              <Switch
                                id={category}
                                disabled={
                                  category === "necessary" || categoryEmpty
                                }
                                checked={categoryConsent.enabled}
                                onCheckedChange={() => {
                                  if (category !== "necessary") {
                                    toggleCategory(
                                      category as keyof Omit<
                                        CookieConsent,
                                        "necessary"
                                      >,
                                    );
                                  }
                                }}
                              />
                            </div>

                            <Accordion
                              key={category}
                              type="single"
                              collapsible
                              className="flex w-full"
                            >
                              <AccordionItem
                                value={category}
                                className="w-full"
                              >
                                <AccordionTrigger className="accordion-content no-blur text-left text-sm text-muted-foreground">
                                  {t(`${category}.description`)}
                                </AccordionTrigger>
                                <AccordionContent className="no-blur">
                                  {!categoryEmpty && (
                                    <p className="mb-4 text-muted-foreground">
                                      {t("servicesList")}:
                                    </p>
                                  )}
                                  {categoryEmpty ? (
                                    <div className="text-left text-sm text-muted-foreground">
                                      {t("notUsed")}
                                    </div>
                                  ) : (
                                    categoryConsent.services &&
                                    Object.entries(
                                      categoryConsent.services,
                                    ).map(([service, value]) => {
                                      const cookieDetails =
                                        services[service as Services];
                                      if (!cookieDetails) return null;
                                      return (
                                        <div
                                          className="mb-2 sm:ml-4"
                                          key={service}
                                        >
                                          <div className="flex justify-between">
                                            <label
                                              htmlFor={service}
                                              className="mb-0 text-sm"
                                            >
                                              {cookieDetails.title}
                                            </label>
                                            <Checkbox
                                              className="mr-2"
                                              id={service}
                                              disabled={
                                                category === "necessary"
                                              }
                                              checked={value as boolean}
                                              onCheckedChange={() => {
                                                toggleService(
                                                  category as keyof Omit<
                                                    CookieConsent,
                                                    "necessary"
                                                  >,
                                                  service,
                                                );
                                              }}
                                            />
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        );
                      },
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="services">
                <ScrollArea className="h-[30vh] w-full space-y-4 border p-4">
                  {Object.entries(consent).map(([category, details], id) => {
                    // console.log('consent', consent);
                    const servicesFromConsent = details.services;
                    // console.log('services', servicesFromConsent);
                    if (servicesFromConsent) {
                      return (
                        <div key={id}>
                          {Object.entries(servicesFromConsent).map(
                            ([service, value]) => {
                              const cookieDetails =
                                services[service as Services];
                              if (!cookieDetails) return null;
                              return (
                                <div className="mb-4" key={service}>
                                  <div className="flex justify-between">
                                    <h5 className="mb-0 text-base font-medium">
                                      {cookieDetails.title}
                                    </h5>
                                    <Switch
                                      className="mb-0"
                                      id={service}
                                      disabled={category === "necessary"}
                                      checked={value as boolean}
                                      onCheckedChange={() => {
                                        toggleService(
                                          category as keyof Omit<
                                            CookieConsent,
                                            "necessary"
                                          >,
                                          service,
                                        );
                                      }}
                                    />
                                  </div>

                                  <Accordion
                                    key={service}
                                    type="single"
                                    className="flex items-center"
                                    collapsible
                                  >
                                    <AccordionItem
                                      value={service}
                                      className="w-full"
                                    >
                                      <AccordionTrigger>
                                        <span className="my-0 text-sm text-muted-foreground">
                                          {t(`${category}.name`)}
                                        </span>
                                      </AccordionTrigger>

                                      <AccordionContent>
                                        <CookieDetails
                                          cookieDetails={cookieDetails}
                                        />
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </div>
                              );
                            },
                          )}
                        </div>
                      );
                    }

                    return null; // Return null if services is undefined
                  })}
                </ScrollArea>
              </TabsContent>
              <DialogFooter className="mt-4">
                <div className="flex w-full flex-col space-y-2">
                  <Button
                    variant="outline"
                    className="w-full text-sm sm:text-base"
                    onClick={handleConfirmSelection}
                  >
                    {t("confirmSettings")}
                  </Button>
                  <Button
                    variant="default"
                    className="w-full text-sm sm:text-base"
                    onClick={handleRejectAll}
                  >
                    {t("rejectAll")}
                  </Button>
                  <Button
                    className="w-full text-sm sm:text-base"
                    onClick={handleAcceptAll}
                  >
                    {t("acceptAll")}
                  </Button>
                </div>
              </DialogFooter>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
