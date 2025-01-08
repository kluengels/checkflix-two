import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import Tutorial from "./_components/Tutorial";
import Features from "./_components/Features";

import { Button } from "@/components/ui/button";
import { GiTv } from "react-icons/gi";
import { HiArrowSmDown } from "react-icons/hi";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <article className="container mx-auto py-0 md:py-12">
      <section className="grid grid-cols-8 items-center justify-end gap-4">
        {/* Title and Subtitle */}
        <div className="order-2 col-span-8 text-center md:col-span-5 md:text-left">
          <h1 className="text-balance text-center text-5xl font-extrabold text-primary md:text-left md:text-5xl lg:text-6xl xl:text-7xl">
            {t("title")}
          </h1>
          <p className="font-semibold sm:text-lg lg:text-xl xl:text-2xl">
            {t("subtitle")}
          </p>
        </div>
        {/* Logo */}
        <div className="order-1 col-span-8 flex justify-center md:order-2 md:col-span-3 md:justify-end">
          <GiTv className="motion-preset-bounce h-full w-full max-w-48 text-secondary motion-duration-1000 md:max-w-96" />
        </div>

        {/* Buttons*/}
        <div className="order-3 col-span-full flex flex-col items-center justify-center gap-4 md:flex-row md:justify-start">
          <Button size="lg" variant="default" className="">
            <Link href="/upload">{t("buttons.start")}</Link>
          </Button>
          <Button variant="link">
            <a href="./#tutorial">{t("buttons.tutorial")}</a>
            <HiArrowSmDown />
          </Button>
        </div>
      </section>
      <Features className="mx-auto my-20 border-[1px] border-secondary px-5 py-4 md:py-10" />
      <Tutorial className="my-20" />
    </article>
  );
}
