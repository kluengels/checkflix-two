import { useTranslations } from "next-intl";
// import logo of TMDB
import TmdbLogo from "@/assets/tmdb_long.svg";
import { GiTv } from "react-icons/gi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function Page() {
  const t = useTranslations("Imprint");
  return (
    <>
      <h1>{t("title")}</h1>

      <section className="mb-6">
        <h2 className="text-3xl">{t("provider.heading")}</h2>
        <p>{t("provider.description")}</p>
        <div className="mt-4">
          Steffen Ermisch
          <br />
          Pressebüro JP4
          <br />
          Richard-Wagner-Str. 10-12
          <br />
          50674 Köln, Germany
          <br />
          {/* display email in spam protected way */}
          <span className="before:content-['che'] after:content-['il.com']">
            ckflix@gma
          </span>
          <p className="font-semibold">
            {" "}
            <a
              href="https://steffen-ermisch.de"
              target="_blank"
              className="hover:underline hover:underline-offset-2"
            >
              https://steffen-ermisch.de
            </a>
          </p>
        </div>
        <Button variant={"outline"} className="mt-4">
          <Link href="/contact">{t("provider.contactbutton")}</Link>
        </Button>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl">{t("disclaimer.heading")}</h2>
        <p>{t("disclaimer.text")}</p>
      </section>

      <section>
        <h2 className="text-3xl">{t("attributions.heading")}</h2>
        <div className="my-6 flex flex-col">
          <Image
            src={TmdbLogo}
            alt="TMDB Logo"
            className="inline-block h-auto w-96"
          />
          <p>
            {t.rich("attributions.tmdb", {
              link: () => (
                <a
                  href=""
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  TMDB API
                </a>
              ),
            })}
          </p>
        </div>
        <div className="my-6 flex flex-col">
          <GiTv className="h-12 w-12" />
          <p>
            {t.rich("attributions.icon", {
              author: () => (
                <a
                  href="https://delapouite.com/"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  Delapouite
                </a>
              ),
              license: () => (
                <a
                  href="https://creativecommons.org/licenses/by/3.0/"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  CC BY 3.0
                </a>
              ),
              link: () => (
                <a
                  href="https://game-icons.net"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  Game-icons.net
                </a>
              ),
            })}
          </p>
        </div>
      </section>
    </>
  );
}
