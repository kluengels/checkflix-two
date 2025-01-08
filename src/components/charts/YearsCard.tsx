"use client";
import { useData } from "@/context/DataProvider";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/routing";

import createDateListFromActivityData from "@/utils/prepareCharts";
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
export function YearsCard({ activityData, className }: YearCardProps) {
  const t = useTranslations("Dashboard.time");
  const locale = useLocale() as Locale;
  const { user } = useData();

  // transform data to a format focussing on date and duration, filter by user
  const dateList = useMemo(() => {
    const rawDateList = createDateListFromActivityData(
      activityData,
      locale,
      user,
    );
    return rawDateList;
  }, [activityData, user, locale]);

  // Calculate total viewTime for user and find first viewing date
  const { viewTime, firstDate } = useMemo(() => {
    let totalTime = 0;
    let earliest = new Date();

    dateList.forEach((item) => {
      totalTime += item.duration;
      if (item.date.getTime() - earliest.getTime() < 0) {
        earliest = item.date;
      }
    });

    return { viewTime: totalTime, firstDate: earliest };
  }, [dateList]);

  // Prepare dates and viewTime for rendering
  const firstMonth = firstDate.toLocaleString(locale, { month: "long" });
  const firstYear = firstDate?.getFullYear();
  const viewTimeHours = hoursFromSeconds(viewTime);
  const viewTimeDays = daysFromSeconds(viewTime);

  // Prepare data for chart
  const chartData: YearChartData = useMemo(() => {
    const data: YearChartData = [];
    dateList.forEach((item) => {
      const hours = item.duration / 60 / 60;
      const existingData = data.find((d) => d.year === item.year);
      if (existingData) {
        existingData.duration += hours;
      } else {
        data.push({ year: item.year, duration: hours });
      }
    });
    // round duration to full hours
    data.forEach((item) => {
      item.duration = Math.round(item.duration);
    });

    return data.sort((a, b) => a.year - b.year); // sort by year (ascending)
  }, [dateList]);

  const chartConfig = {
    duration: {
      label: t("chartLabel"),
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  if (hoursFromSeconds(viewTime) === 0) return null;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="">
          <p className="my-0 text-base">{t("head")}</p>
          <h2 className="text-6xl sm:text-7xl">
            {viewTimeHours}{" "}
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
              fill="var(--color-duration)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
