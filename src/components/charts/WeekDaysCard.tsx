"use client";
import { useData } from "@/context/DataProvider";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Locale } from "@/i18n/routing";

import createDateListFromActivityData from "@/utils/prepareCharts";
import { hoursFromSeconds } from "@/utils/transformDuration";
import SelectYear from "../selects/SelectYear";
import { cn } from "@/lib/utils";

import { Activity, WeekdayChartData } from "@/types/customTypes";

import { PolarAngleAxis, PolarGrid, RadarChart, Radar } from "recharts";

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
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface WeekdaysCardProps {
  activityData: Activity[];
  className?: string;
}
/**
 * Renders a card with a sppider-net-like radar chart showing the weekdays and the time watching Netflix on those days. Can be filtered by year.
 * The most popular day is displayed in the header.
 * @param activityData - the combined movie and tv show data serving as the source for the chart
 * @param className - optional additional className
 * @returns a card with a radar chart
 */
export default function WeekdaysCard({
  activityData,
  className,
}: WeekdaysCardProps) {
  const t = useTranslations("Dashboard.weekdays");
  const locale = useLocale() as Locale;
  const { user, activeYear, setActiveYear } = useData();

  // transform data to a format focussing on date and duration, filtered by user
  const dateList = useMemo(() => {
    const rawDateList = createDateListFromActivityData(
      activityData,
      locale,
      user,
    );
    return rawDateList;
  }, [activityData, user, locale]);

  // get list of all years from data
  const years = useMemo(() => {
    return Array.from(new Set(dateList.map((item) => item.year)));
  }, [dateList]);

  // prepare data for chart
  const chartData = useMemo(() => {
    const data: WeekdayChartData[] = [];

    // create objects ilke {day: "Monday", 2021: 0, 2022: 0, ...}
    dateList.forEach((item) => {
      const existingItem = data.find((chartItem) => chartItem.day === item.day);
      if (existingItem) {
        existingItem[item.year] =
          (existingItem[item.year] || 0) + hoursFromSeconds(item.duration);
      } else {
        const newItem = initializeWeekdayData(item.day, years);
        newItem[item.year] = hoursFromSeconds(item.duration);
        data.push(newItem);
      }
    });

    // sort data by weekday
    return sortByWeekday(data, locale);
  }, [dateList, years, locale]);

  // filter chart data by selected year
  const filteredChartData = useMemo(() => {
    return filterDataByYear(chartData, activeYear);
  }, [chartData, activeYear]);

  // filter years array if active year is selected
  const filteredYears = useMemo(() => {
    if (!activeYear) return years;
    return [activeYear];
  }, [years, activeYear]);

  // get most popular weekDay
  const mostPopularDay = useMemo(() => {
    return calculateMostPopularDay(filteredChartData, filteredYears);
  }, [filteredChartData, filteredYears]);

  // create chart config
  const chartConfig = createChartConfig(years) satisfies ChartConfig;

  if (dateList.length === 0) return null;
  if (years.length === 0) return null;

  // check if the hightest duration in chartData is greater than 0
  const hasData = chartData.some((item) =>
    filteredYears.some((year) => item[year] > 0),
  );
  if (!hasData) return null;

  return (
    <Card className={cn("w-full", className)}>
      {/* Header renders the most popular weekday in a given year and a year selector */}
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="text-3xl sm:text-6xl">
            {mostPopularDay}
          </CardTitle>
          <CardDescription>
            {activeYear
              ? t("descriptionYear", { activeYear })
              : t("descriptionAllYears")}
          </CardDescription>
        </div>
        <SelectYear
          activeYear={activeYear}
          setActiveYear={setActiveYear}
          years={years}
          chartConfig={chartConfig}
        />
      </CardHeader>

      {/* Card Content renders the radar chart for given year */}
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto mb-6 aspect-square max-h-[650px]"
        >
          <RadarChart data={chartData} outerRadius="52%" className="m-0">
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  className="w-[160px]"
                  formatter={(value, name, item, index) => {
                    return (
                      <>
                        {/* Display duration in hours for each year */}
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                          style={
                            {
                              "--color-bg": `var(--color-${name})`,
                            } as React.CSSProperties
                          }
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {value}
                          <span className="font-normal text-muted-foreground">
                            {t("hours", { count: Number(value) })}
                          </span>
                        </div>
                        {/* Show total duration for all years */}

                        {index === years.length - 1 && (
                          <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                            {t("total")}
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              {calulateTotalDuration(item.payload)}
                              <span className="font-normal text-muted-foreground">
                                {t("hours", {
                                  count: calulateTotalDuration(item.payload),
                                })}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  }}
                />
              }
              cursor={false}
            />
            <PolarAngleAxis dataKey="day" />
            <PolarGrid radialLines={false} />
            {filteredYears.map((year) => (
              <Radar
                key={year}
                dataKey={year}
                fill={chartConfig[year].color}
                fillOpacity={0}
                stroke={chartConfig[year].color}
                strokeWidth={2}
              />
            ))}
            <ChartLegend />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Get the weekdays in the correct order for the current locale
 */
function getWeekDays(locale: Locale) {
  if (locale === "en") {
    return [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
  } else {
    return [
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
      "Sonntag",
    ];
  }
}

// helper functions

const sortByWeekday = (data: WeekdayChartData[], locale: Locale) => {
  const dayOrder = getWeekDays(locale);
  return data.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
};

const filterDataByYear = (
  data: WeekdayChartData[],
  year: number | null | undefined,
): WeekdayChartData[] => {
  if (!year) return data;

  return data.map((item) => ({
    day: item.day,
    [year]: item[year],
  }));
};

const initializeWeekdayData = (
  day: string,
  years: number[],
): WeekdayChartData => {
  const weekdayData: WeekdayChartData = { day };
  years.forEach((year) => {
    weekdayData[year] = 0;
  });
  return weekdayData;
};

const createChartConfig = (
  years: number[],
): { [key: number]: { label: string; color: string } } => {
  const config: { [key: number]: { label: string; color: string } } = {};
  years.forEach((year, index) => {
    config[year] = {
      label: year.toString(),
      color: `hsl(var(--chart-${index + 1}))`,
    };
  });
  return config;
};

const calculateMostPopularDay = (
  filteredChartData: WeekdayChartData[],
  filteredYears: number[],
): string => {
  const durationByDay: {
    day: string;
    duration: number;
  }[] = filteredChartData.map((item) => ({
    day: item.day,
    duration: filteredYears.reduce((acc, year) => acc + (item[year] || 0), 0),
  }));

  return durationByDay.sort((a, b) => b.duration - a.duration)[0].day;
};

const calulateTotalDuration = (payload: Record<string, number | string>) => {
  return Object.entries(payload)
    .filter(([key, value]) => key !== "day" && typeof value === "number")
    .reduce((sum, [, value]) => sum + (value as number), 0);
};
