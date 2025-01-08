import Link from "next/link";
import PolicyDE from "./_components/PolicyDE";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/i18n/routing";
import PolicyEN from "./_components/PolicyEN";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);
  const t = await getTranslations("Privacy");

  return (
    <>
      <h1>{t("title")}</h1>

      {/* short summary in easy words */}
      <section className="dark:border-border-dark dark:bg-card-dark rounded-lg border border-border border-opacity-50 bg-card p-6 dark:text-foreground">
        <h2>{t("short.heading")}</h2>
        <h3 className="mb-1 mt-3 text-lg font-semibold">
          {t("short.purpose.heading")}
        </h3>
        <p className="text-pretty">
          {t.rich("short.purpose.text", {
            harvard: (chunks) => (
              <a
                href="https://pll.harvard.edu/course/cs50-introduction-computer-science"
                target="_blank"
                className="underline underline-offset-2"
              >
                {chunks}
              </a>
            ),
            imprint: () => (
              <Link href={`/imprint`} className="underline underline-offset-2">
                Steffen Ermisch
              </Link>
            ),
          })}
        </p>
        <h3 className="mb-1 mt-3 text-lg font-semibold">
          {t("short.hosting.heading")}
        </h3>
        <p className="text-pretty">
          {t.rich("short.hosting.text", {
            provider: (chunks) => (
              <a
                href="https://www.hetzner.com/de/legal/privacy-policy/"
                target="_blank"
                className="underline underline-offset-2"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
        <h3 className="mb-1 mt-3 text-lg font-semibold">
          {t("short.data.heading")}
        </h3>
        <p className="text-pretty">
          {t.rich("short.data.text", {
            upload: (chunks) => (
              <Link href={`/upload`} className="underline underline-offset-2">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <h3 className="mb-1 mt-3 text-lg font-semibold">
          {t("short.analytics.heading")}
        </h3>
        <p className="text-pretty">{t("short.analytics.text")}</p>
        <h3 className="mb-1 mt-3 text-lg font-semibold">
          {t("short.contact.heading")}
        </h3>
        <p className="text-pretty">{t("short.contact.text")}</p>
        <h3 className="mb-1 mt-3 text-lg font-semibold">
          {t("short.rights.heading")}
        </h3>
        <p className="text-pretty">{t("short.rights.text")}</p>
      </section>

      {/* long, formal, version */}
      <section className="my-6">
        <h2>{t("detailed.heading")}</h2>
        {locale === "de" ? <PolicyDE /> : <PolicyEN />}
      </section>
    </>
  );
}
