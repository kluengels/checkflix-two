// Error Page for all unhandled errors in the app

"use client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

import getErrorMessage from "../../utils/getErrorMessage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Errors");
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <article className="relative h-innerfull w-full text-background dark:text-foreground">
        <Image
          src="/cinema.jpg"
          alt="404"
          className="-z-10 h-full w-full object-cover"
          width={2000}
          height={1600}
        />
        <div className="absolute top-20 w-full pr-10 text-right">
          <h2 className="my-6 text-2xl font-extrabold sm:text-6xl lg:text-6xl">
            <span className="px-2">{t("excuse")}</span>
          </h2>
          <p className="mb-12 text-xl">
            <span className="p-2">
              {t("message")}: {getErrorMessage(error)}
            </span>
          </p>
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            aria-label={t("againButton")}
          >
            {t("againButton")}
          </Button>

          <Button asChild aria-label={t("reportButton")} className="ml-2">
            <Link href="/contact">{t("reportButton")}</Link>
          </Button>
        </div>
        <div className="absolute bottom-4 left-4 text-sm">
          {t("foto")}:{" "}
          <a
            href="https://unsplash.com/de/@felixmooneeram?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            target="_blank"
          >
            Felix Mooneeram
          </a>
          ,{" "}
          <a
            href="https://unsplash.com/de/fotos/red-cinema-chair-evlkOfkQ5rE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            target="_blank"
          >
            Unsplash
          </a>
        </div>
      </article>
    </>
  );
}
