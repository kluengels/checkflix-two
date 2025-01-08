import { TmdbImage } from "@/components/layouts/TmdbImage";
import { EnrichedActivity } from "@/types/customTypes";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/routing";
import { Dispatch, SetStateAction, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useData } from "@/context/DataProvider";
import { hoursFromSeconds } from "@/utils/transformDuration";
import { getFirstAndLastYear, getLatestWatchedDate } from "@/utils/filterDates";

interface MoviesOrSeriesGridProps {
  data: EnrichedActivity[];
  setSelectedGenre: Dispatch<SetStateAction<string | undefined>>;
  type?: "movies" | "tv";
  className?: string;
}

/**
 * Renders a grid of Cards for movies or tv shows with additional information like last watched date, total duration, summary and genres
 */
export default function MoviesOrSeriesGrid({
  data,
  setSelectedGenre,
  type = "movies",
  className,
}: MoviesOrSeriesGridProps) {
  const locale = useLocale() as Locale;
  const isMovies = type === "movies";
  const t = useTranslations("Grid");
  const { user } = useData();

  useEffect(() => {
    if (data.length === 0) setSelectedGenre(undefined);
  }, [data, setSelectedGenre]);

  if (data.length === 0)
    return (
      <div className="text-destructive">
        {isMovies
          ? t("noMoviesFoundForUser", { user })
          : t("noSeriesFoundForUser", { user })}
      </div>
    );

  return (
    <>
      <div
        className={cn(
          "mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3",
          className,
        )}
      >
        {data.map((item, idx) => {
          // calculate last watched date
          const lastWatched = getLatestWatchedDate(item.date);

          // get first and last year in watch dates
          const { firstYear, lastYear } = getFirstAndLastYear(item.date);

          return (
            <Card key={idx} className="rounded-none">
              <CardHeader className="mb-4 p-0">
                <TmdbImage item={item} />
              </CardHeader>
              <CardContent>
                <h2 className="overflow-clip text-pretty font-display text-2xl font-bold">
                  {item.title}
                </h2>
                {/* For movies displays the last watched date */}
                {isMovies && lastWatched && (
                  <p className="mt-1 text-sm">
                    {t("lastWatched")}
                    {lastWatched.toLocaleString(locale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}

                {/* For Tv shows display the total duration in minutes */}

                {!isMovies && (
                  <p className="mt-1 text-sm">
                    <span>
                      {t("watchedFor", {
                        count: hoursFromSeconds(item.duration).toLocaleString(
                          locale,
                        ),
                      })}
                    </span>
                    <span>
                      {" "}
                      &#040;{firstYear}
                      {firstYear !== lastYear && ` - ${lastYear}`}&#041;
                    </span>
                    .
                  </p>
                )}

                {item.summary && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="border-none">
                      <AccordionTrigger>{t("about")}</AccordionTrigger>
                      <AccordionContent>{item.summary ?? ""}</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                <div className="ml-[-8] flex flex-wrap leading-none">
                  {item.genres?.map((genre, id) => {
                    return (
                      <button key={id} onClick={() => setSelectedGenre(genre)}>
                        <span className="rounded-md px-2 py-1 text-sm italic hover:bg-accent">
                          #{genre}{" "}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
