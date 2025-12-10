import { useData } from "@/context/DataProvider";
import { EnrichedActivity } from "@/types/customTypes";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link } from "@/i18n/routing";
import { BiChevronsRight } from "react-icons/bi";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { hoursFromSeconds } from "@/utils/transformDuration";
import { TmdbImage } from "@/components/layouts/TmdbImage";

interface TopSeriesCardProps {
  activityData: EnrichedActivity[];
  className?: string;
}
/**
 * Redners a card with the most viewed tv show, followed by a bar chart showing the top 5 tv shows by duration
 */
export default function TopSeriesCard({
  activityData,
  className,
}: TopSeriesCardProps) {
  const t = useTranslations("Dashboard.topSeries");
  const { user } = useData();
  const showAllUsers = user === "all";

  // find the 5 series with highest duration, filtered by user; input data is already sorted by duration
  const topSeries = useMemo(() => {
    return activityData
      .filter((item) =>
        showAllUsers
          ? item.genres && item.genres.length > 0
          : item.genres && item.genres.length > 0 && item.user === user,
      )
      .slice(0, 5);
  }, [activityData, showAllUsers, user]);

  // set color for the labels in chart
  const chartConfig = {
    label: {
      color: "(var(--background)",
    },
  } satisfies ChartConfig;

  // abort if no data is available
  if (topSeries.length === 0) return null;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="">
          <TmdbImage item={topSeries[0]} className="w-full" />
          <p className="mt-4 mb-0 text-base">{t("title")}</p>
          <h2 className="text-5xl text-pretty sm:text-6xl">
            {topSeries[0]?.title}
          </h2>
        </CardTitle>
        <CardDescription className="text-pretty">
          {t("description", {
            count: hoursFromSeconds(topSeries[0]?.duration),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={topSeries}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="title"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="duration" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, _unit, item) => {
                      return (
                        <div className="flex flex-col">
                          <div className="font-bold">{item.payload.title}</div>
                          <div className="py-0">
                            <span className="font-bold">
                              {hoursFromSeconds(Number(value))}
                            </span>{" "}
                            hours
                          </div>
                        </div>
                      );
                    }}
                    indicator="line"
                  />
                }
              />
              <Bar
                dataKey="duration"
                layout="vertical"
                fill="var(--color-chart-1)"
                radius={4}
              >
                <LabelList
                  dataKey="title"
                  position="insideLeft"
                  offset={8}
                  className="fill-[var(--background)] sm:block"
                  fontSize={12}
                  formatter={(value: string) => {
                    if (value === topSeries[0].title) {
                      let label = "";
                      const slice = value.slice(0, 20);
                      label += slice;

                      if (slice.length < value.length) {
                        label += "...";
                      }
                      return label;
                    }
                  }}
                />
                {/* <LabelList
                  dataKey="duration"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                /> */}
              </Bar>
            </BarChart>
          </ChartContainer>
        </>
      </CardContent>
      <CardFooter>
        <Link
          href="/series"
          aria-label="Find out more about your viewing habits"
          className="text-primary flex items-center hover:cursor-pointer hover:underline hover:underline-offset-2"
        >
          <BiChevronsRight className="h-8 w-8" />
          {t("linkText")}{" "}
        </Link>
      </CardFooter>
    </Card>
  );
}
