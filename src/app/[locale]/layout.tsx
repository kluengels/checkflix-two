// route layout with Providers, Metadata, and other configurations

import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { Locale, routing } from "@/i18n/routing";
import Script from "next/script";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

import "../globals.css";
import { Carter_One, Nunito } from "next/font/google";

import { ThemeProvider } from "@/context/ThemeProvider";
import { DataProvider } from "@/context/DataProvider";

const carterOne = Carter_One({
  display: "swap",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  display: "swap",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Set metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  };
}

export default async function LocaleLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${nunito.className} ${carterOne.className}`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Checkflix" />
      </head>
      <body className="">
        <ThemeProvider defaultTheme="system" storageKey="next-ui-theme">
          <DataProvider>
            <NextIntlClientProvider messages={messages}>
              <header>
                <Navbar />
              </header>

              <main className="mx-auto min-h-innerfull">{children}</main>
              <footer>
                <Footer />
              </footer>
            </NextIntlClientProvider>
          </DataProvider>
        </ThemeProvider>
      </body>
      <Script
        src={process.env.NEXT_PUBLIC_UMAMI_URL}
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
        strategy="lazyOnload"
      />
    </html>
  );
}
