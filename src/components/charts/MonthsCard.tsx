import { useData } from "@/context/DataProvider";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Locale } from "@/i18n/routing";

import { hoursFromSeconds } from "@/utils/transformDuration";
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
export default function MonthCard({ activityData, className }: MonthCardProps) {
  const t = useTranslations("Dashboard.months");
  const locale = useLocale() as Locale;
  const { user, activeYear, setActiveYear } = useData();

  // chartdata is array of objects with structure like {month: "January", 2021: 0, 2022: 0, ...}
  const { chartData, years } = useMemo(() => {
    const data: { [year: number]: number; month: number }[] = [];

    activityData.forEach((activity) => {
      // filter by user
      if (user !== "all" && activity.user !== user) return;

      // check if month is already in data
      const monthIndex = data.findIndex(
        (item) => item.month === activity.date.getMonth(),
      );

      // if month is not in data, add it
      if (monthIndex === -1) {
        data.push({
          month: activity.date.getMonth(),
          [activity.date.getFullYear()]: hoursFromSeconds(activity.duration),
        });
      } else {
        // if day is in data, check if year is already in day-object
        if (data[monthIndex][activity.date.getFullYear()]) {
          data[monthIndex][activity.date.getFullYear()] += hoursFromSeconds(
            activity.duration,
          );
        } else {
          data[monthIndex][activity.date.getFullYear()] = hoursFromSeconds(
            activity.duration,
          );
        }
      }
    });

    // Extract unique years
    const years = Array.from(
      new Set(
        data.flatMap(
          (obj) =>
            Object.keys(obj)
              .filter((key) => key !== "month") // Exclude the "month" key
              .map((key) => Number(key)), // Convert keys to numbers
        ),
      ),
    );

    // if a year is missing in the data, add it with 0 hours
    data.forEach((item) => {
      years.forEach((year) => {
        if (!item[year]) {
          item[year] = 0;
        }
      });
    });

    // sort data by month
    const sortedByMonth = data.sort((a, b) => a.month - b.month);

    // replace day number with weekday name
    const sortedWithMonthString: MonthChartData[] = sortedByMonth.map(
      (item) => ({
        ...item,
        month: new Date(0, item.month).toLocaleDateString(locale, {
          month: "long",
        }),
      }),
    );

    return { chartData: sortedWithMonthString, years };
  }, [activityData, user, locale]);

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
  if (chartData.length === 0) return null;
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
      <CardContent className="pt-10 pb-0">
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
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{
                            backgroundColor:
                              chartConfig[name as keyof typeof chartConfig]
                                ?.color,
                          }}
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {value}
                          <span className="text-muted-foreground font-normal pl-1">
                            {t("hours", { count: Number(value) })}
                          </span>
                        </div>

                        {/*Show total for years */}

                        {index === years.length - 1 && (
                          <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                            {t("total")}
                            <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                              {calulateTotalDuration(item.payload)}
                              <span className="text-muted-foreground font-normal">
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

// helper functions

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
      color: `var(--chart-${index + 1})`,
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
