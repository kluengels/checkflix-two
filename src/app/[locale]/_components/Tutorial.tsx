/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import Link from "next/link";

import {
  TbCircleNumber1,
  TbCircleNumber2,
  TbCircleNumber3,
} from "react-icons/tb";

/**
  * Tutorial component for the homepage: 3 Cards with steps to follow
 */
export default function Tutorial({ className }: { className?: string }) {
  const t = useTranslations("HomePage.Tutorial");
  return (
    <section className={className} id="tutorial">
      <h2 className="mb-6 text-center">{t("title")}</h2>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Step 1 */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-1 text-pretty">
              <TbCircleNumber1 className="h-10 w-10 flex-shrink-0" />
              <span> {t("step1.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {t.rich("step1.description", {
              link: (chunks) => (
                <a
                  href="https://www.netflix.com/account/getmyinfo"
                  target="_blank"
                  className="text-secondary decoration-secondary underline-offset-2 hover:underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </CardContent>
          <CardFooter>
            <Button variant={"outline"} aria-label={t("step1.button")}>
              <a
                href="https://www.netflix.com/account/getmyinfo"
                target="_blank"
              >
                {t("step1.button")}
              </a>
            </Button>
          </CardFooter>
        </Card>
        {/* Step 2 */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-1 text-pretty">
              <TbCircleNumber2 className="h-10 w-10 flex-shrink-0" />
              <span>{t("step2.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {t.rich("step2.description", {
              highlight1: () => (
                <span className="bg-accent px-1 py-0.5">
                  netflix-report.zip
                </span>
              ),
              highlight2: () => (
                <span className="bg-accent px-1 py-0.5">
                  {" "}
                  ViewingActivity.csv
                </span>
              ),
            })}
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <img src="./screenshot.png" alt="Screenshot" width="300px" className="max-w-full border " />
          </CardFooter>
        </Card>
        {/* Step 3 */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-1 text-pretty">
              <TbCircleNumber3 className="h-10 w-10 flex-shrink-0" />
              <span>{t("step3.title")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>{t("step3.description")}</CardContent>
          <CardFooter>
            <Button>
              <Link href="/upload">{t("step3.button")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
