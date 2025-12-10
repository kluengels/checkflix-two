import { useData } from "@/context/DataProvider";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/routing";

import { daysFromSeconds, hoursFromSeconds } from "@/utils/transformDuration";
import { cn } from "@/lib/utils";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Activity, YearChartData } from "@/types/customTypes";

interface YearCardProps {
  activityData: Activity[];
  className?: string;
}
/**
 * Renders a card with a summary of the total viewTime of the user and a chart with the viewTime per year
 */
export default function YearsCard({ activityData, className }: YearCardProps) {
  const t = useTranslations("Dashboard.time");
  const locale = useLocale() as Locale;
  const { user } = useData();

  const { chartData, viewTime, firstDate } = useMemo(() => {
    let viewTime = 0;
    let firstDate = new Date();
    const chartData: YearChartData = [];

    activityData.forEach((activity) => {
      // filter by user
      if (user !== "all" && activity.user !== user) return;
      // add duration to viewTime
      viewTime += activity.duration;

      // set firstDate if date in activity is earlier than firstDate
      if (!firstDate || activity.date < firstDate) {
        firstDate = activity.date;
      }

      // check if year is already in dateList
      const yearIndex = chartData.findIndex(
        (item) => item.year === activity.date.getFullYear(),
      );
      // if year is not in dateList, add it
      if (yearIndex === -1) {
        chartData.push({
          year: activity.date.getFullYear(),
          duration: activity.duration,
        });
      } else {
        // if year is in dateList, add duration to existing year
        chartData[yearIndex].duration += activity.duration;
      }
    });

    // sort chartData by year (ascending)
    chartData.sort((a, b) => a.year - b.year);

    // transform time in chartData to hours
    chartData.forEach((item) => {
      item.duration = hoursFromSeconds(item.duration);
    });

    return { chartData, viewTime, firstDate };
  }, [activityData, user]);

  // Prepare dates and viewTime for rendering
  const firstMonth = firstDate.toLocaleString(locale, { month: "long" });
  const firstYear = firstDate.getFullYear();
  const viewTimeHours = hoursFromSeconds(viewTime);
  const viewTimeDays = daysFromSeconds(viewTime);

  const chartConfig = {
    duration: {
      label: t("chartLabel"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  if (hoursFromSeconds(viewTime) === 0) return null;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="">
          <p className="my-0 text-base">{t("head")}</p>
          <h2 className="text-6xl sm:text-7xl">
            {viewTimeHours.toLocaleString(locale)}{" "}
            <span className="text-4xl">
              {t("title", { viewTimeHours: viewTimeHours })}
            </span>
          </h2>
        </CardTitle>
        <CardDescription>
          {t("description", { firstMonth: firstMonth, firstYear: firstYear })}{" "}
          {t("inDays", { viewTimeDays: viewTimeDays, count: viewTimeDays })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              //   tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="duration"
              //   name="Hours Watched:&nbsp;"
              fill="var(--chart-1)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
