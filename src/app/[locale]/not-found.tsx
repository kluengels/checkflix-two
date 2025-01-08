// Not found page with a 404 image and a button to return to the homepage

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function NotFound() {
  const t = useTranslations("Errors");
  return (
    <div className="h-innerfull relative w-full text-background dark:text-foreground">
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
          <span className="p-2">{t("notfound")}</span>
        </p>
        <Button asChild aria-label={t("homeButton")}>
          <Link href="/">{t("homeButton")}</Link>
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
    </div>
  );
}
