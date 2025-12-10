import { useData } from "@/context/DataProvider";
import { useMemo } from "react";
import { Link, Locale } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BiChevronsRight } from "react-icons/bi";

import { cn } from "@/lib/utils";

import { EnrichedActivity } from "@/types/customTypes";

interface GenresCardProps {
  activityData: EnrichedActivity[];
  type: "movies" | "tv";
  className?: string;
}

/**
 * Renders a card with the number of movies / tv shows watched and their respective genres in a Chart
 */
export default function GenresCard({
  activityData,
  type,
  className,
}: GenresCardProps) {
  const t = useTranslations("Dashboard.genres");
  const locale = useLocale() as Locale;
  const { user } = useData();
  const isMovie = type === "movies";
  const showAllUsers = user === "all";

  const { itemsCount, genreMap } = useMemo(() => {
    const result = {
      itemsCount: 0,
      genreMap: new Map<string, number>(),
    };

    activityData.forEach((item) => {
      if (!showAllUsers && item.user !== user) {
        return;
      }
      // Count the number of movies / tv shows watched for user
      result.itemsCount++;

      //  genreList calculations
      if (item.genres?.length) {
        item.genres.forEach((genre) => {
          if (genre) {
            result.genreMap.set(genre, (result.genreMap.get(genre) || 0) + 1);
          }
        });
      }
    });

    return result;
  }, [activityData, showAllUsers, user]);

  // Transform the genres array into an object with the genre as key and the count as value
  const chartData = useMemo(() => {
    return (
      Array.from(genreMap, ([genre, count]) => ({ genre, count }))

        // sort decending by count
        .sort((a, b) => b.count - a.count)

        // assing a color to each genre
        .map((item, index) => ({
          ...item,
          fill: `var(--chart-${index + 1})`,
        }))
    );
  }, [genreMap]);

  // check if highest count applies to multiple genres (used to highlight multiple genres in the chart)
  const activeIndexArray = useMemo(() => {
    const highestCount = chartData[0]?.count || 0;
    return chartData
      .map((item, index) => (item.count === highestCount ? index : -1))
      .filter((index) => index !== -1);
  }, [chartData]);

  // Count number of genres
  const genreCount = chartData.length;

  const chartConfig = {} satisfies ChartConfig;

  if (chartData.length === 0) return null;
  if (genreCount === 0) return null;
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="">
          <p className="my-0 text-base">{t("head")}</p>
          <h2 className="text-6xl sm:text-7xl">
            {itemsCount}{" "}
            <span className="text-4xl">
              {isMovie
                ? t("titleMovies", { itemsCount })
                : t("titleTv", { itemsCount })}
            </span>
          </h2>
        </CardTitle>
        <CardDescription className="text-pretty">
          {t("description", { genreCount })} {t("descriptionHint")}{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="w-[180px]"
                  formatter={(value, name, item) => (
                    <div className="text-muted-foreground flex min-w-[130px] items-center gap-2 text-xs">
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{
                          backgroundColor: item.payload.fill,
                        }}
                      />
                      {name}
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        {value}
                      </div>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="genre"
              paddingAngle={2}
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndexArray}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            >
              {/* Label is only shown if one genre is clearly the most popular */}
              {chartData.length >= 2 &&
                chartData[0].count > chartData[1].count && (
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <>
                            <text x={(viewBox.cx || 0) + 125} textAnchor="end">
                              <tspan
                                y={14}
                                //   textLength={100}
                                className="fill-muted-foreground"
                              >
                                {chartData[0].genre}
                              </tspan>
                              <tspan
                                x={(viewBox.cx || 0) + 125}
                                y={50}
                                className="fill-muted-foreground text-3xl font-bold"
                              >
                                {chartData[0].count.toLocaleString(locale)}
                              </tspan>
                            </text>
                          </>
                        );
                      }
                    }}
                  />
                )}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <Link
          href={isMovie ? "/movies" : "/series"}
          aria-label={isMovie ? t("linkTextMovies") : t("linkTextTv")}
          className="text-primary flex items-center hover:cursor-pointer hover:underline hover:underline-offset-2"
        >
          <BiChevronsRight className="h-8 w-8" />
          {isMovie ? t("linkTextMovies") : t("linkTextTv")}
        </Link>
      </CardFooter>
    </Card>
  );
}
