"use client";
import { useData } from "@/context/DataProvider";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Locale } from "@/i18n/routing";

import { hoursFromSeconds } from "@/utils/transformDuration";
import createDateListFromActivityData from "@/utils/prepareCharts";
import SelectYear from "../selects/SelectYear";
import { cn } from "@/lib/utils";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

import { Activity, MonthChartData } from "@/types/customTypes";

interface MonthCardProps {
  activityData: Activity[];
  className?: string;
}
/**
 * Renders a card with a stacked area chart showing the months and the time watching Netflix on those months. Can be filtered by year.
 * The most popular months is displayed in the header.
 * @param activityData - the combined movie and tv show data serving as the source for the chart
 * @param className - optional additional className
 * @returns a card with a stacked area chart
 */
export function MonthCard({ activityData, className }: MonthCardProps) {
  const t = useTranslations("Dashboard.months");
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

  // get list of all years in unfiltered data
  const years = useMemo(() => {
    return Array.from(new Set(dateList.map((item) => item.year)));
  }, [dateList]);

  // prepare data for chart
  const chartData = useMemo(() => {
    const data: MonthChartData[] = [];
    // create objects like {month: "January", 2021: 0, 2022: 0, ...}
    dateList.forEach((item) => {
      const existingItem = data.find(
        (chartItem) => chartItem.month === item.month,
      );
      if (existingItem) {
        existingItem[item.year] =
          (existingItem[item.year] || 0) + hoursFromSeconds(item.duration);
      } else {
        const newItem = initializeMonthData(item.month, years);
        newItem[item.year] = hoursFromSeconds(item.duration);
        data.push(newItem);
      }
    });
    // sort by month
    return sortByMonth(data, locale);
  }, [dateList, years, locale]);

  // filter chart data by selected year
  const filteredChartData = useMemo(() => {
    return filterDataByYear(chartData, activeYear);
  }, [chartData, activeYear]);

  // filter years array if active year is selected
  const filteredYears = useMemo(() => {
    if (!activeYear) return [...years].sort();
    return [activeYear];
  }, [years, activeYear]);

  // get most popular month, will be displayed in the card header
  const mostPopularMonth = useMemo(() => {
    return calculateMostPopularMonth(filteredChartData, filteredYears);
  }, [filteredChartData, filteredYears]);

  // create chart config
  const chartConfig = createChartConfig(years) satisfies ChartConfig;

  // check if data is available
  if (dateList.length === 0) return null;
  if (years.length === 0) return null;
  const hasData = chartData.some((item) =>
    filteredYears.some((year) => item[year] > 0),
  );
  if (!hasData) return null;

  return (
    <Card className={cn("", className)}>
      {/* Card Header shows the most popular month and a select input for filtering by year */}
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="mr-5 grid gap-1">
          <CardDescription className="text-balance">
            {activeYear
              ? t("descriptionYear", { activeYear })
              : t("descriptionAllYears")}
          </CardDescription>
          <CardTitle className="text-3xl sm:text-6xl">
            {mostPopularMonth}
          </CardTitle>
        </div>
        <SelectYear
          activeYear={activeYear}
          setActiveYear={setActiveYear}
          years={years}
          chartConfig={chartConfig}
        />
      </CardHeader>

      {/* Card Content shows the stacked area chart */}
      <CardContent className="pb-0 pt-10">
        <ChartContainer config={chartConfig} className="mb-6">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 40,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              domain={[0, "auto"]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value} h`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  className="w-[160px]"
                  formatter={(value, name, item, index) => {
                    return (
                      <>
                        {/*Show watchtime in given month for every year */}
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
                            {t("hours")}
                          </span>
                        </div>

                        {/*Show total for years */}

                        {index === years.length - 1 && (
                          <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                            {t("total")}
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              {calulateTotalDuration(item.payload)}
                              <span className="font-normal text-muted-foreground">
                                {t("hours")}
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
            {filteredYears.sort().map((year) => (
              <Area
                key={year}
                dataKey={year}
                type="natural"
                fill={chartConfig[year].color}
                fillOpacity={0.5}
                stroke={chartConfig[year].color}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Get the month names in the correct order for the current locale
 */
function getMonth(locale: Locale) {
  if (locale === "en") {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  } else {
    return [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ];
  }
}

// helper functions
const sortByMonth = (data: MonthChartData[], locale: Locale) => {
  const dayOrder = getMonth(locale);
  return data.sort(
    (a, b) => dayOrder.indexOf(a.month) - dayOrder.indexOf(b.month),
  );
};

const filterDataByYear = (
  data: MonthChartData[],
  year: number | null | undefined,
): MonthChartData[] => {
  if (!year) return data;

  return data.map((item) => ({
    month: item.month,
    [year]: item[year],
  }));
};

const initializeMonthData = (
  month: string,
  years: number[],
): MonthChartData => {
  const monthData: MonthChartData = { month };

  years.forEach((year) => {
    monthData[year] = 0;
  });

  return monthData;
};

/**
 * Create the chart config object with colors and labels
 */
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

/**
 * Calculate the most popular month
 */
const calculateMostPopularMonth = (
  filteredChartData: MonthChartData[],
  filteredYears: number[],
): string => {
  const durationByMonth: {
    month: string;
    duration: number;
  }[] = filteredChartData.map((item) => ({
    month: item.month,
    duration: filteredYears.reduce((acc, year) => acc + (item[year] || 0), 0),
  }));

  return durationByMonth.sort((a, b) => b.duration - a.duration)[0].month;
};

/**
 * Calculate the total duration of all the years in tooltip
 */
const calulateTotalDuration = (payload: Record<string, number | string>) => {
  return Object.entries(payload)
    .filter(([key, value]) => key !== "month" && typeof value === "number")
    .reduce((sum, [, value]) => sum + (value as number), 0);
};
