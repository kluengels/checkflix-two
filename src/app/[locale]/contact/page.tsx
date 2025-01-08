import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/i18n/routing";
import { Suspense } from "react";

import ContactForm from "./_components/Form";

import { LoadingComponent } from "@/components/ui/LoadingComponent";

// set metadadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");

  // return localized title and description
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <>
      <div className="">
        <h1>{t("title")}</h1>
        <p>{t("subtitle")}</p>
        <Suspense fallback={<LoadingComponent />}>
          <ContactForm />
        </Suspense>
      </div>
    </>
  );
}
