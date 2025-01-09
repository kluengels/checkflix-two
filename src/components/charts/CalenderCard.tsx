"use client";
import { useData } from "@/context/DataProvider";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Locale } from "@/i18n/routing";

import { cn } from "@/lib/utils";
import SelectYear from "../selects/SelectYear";

import { CalendarTooltipProps, ResponsiveCalendar } from "@nivo/calendar";
import { BasicTooltip } from "@nivo/tooltip";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartConfig } from "@/components/ui/chart";
import { RxRotateCounterClockwise } from "react-icons/rx";

import { Activity, CalenderChartData } from "@/types/customTypes";

interface CalenderCardProps {
  activityData: Activity[];
  className?: string;
}
/**
 * Renders a card with a github activities like chart showing boxes for every day of a year. The darker the color the more time was spent watching Netflix.
 * The day with the most viewing hours of the calender year is displayed in the header.
 * @param activityData - the combined movie and tv show data serving as the source for the chart
 * @param className - optional additional className
 * @returns a card with a github activities like chart
 */
export default function CalenderCard({
  activityData,
  className,
}: CalenderCardProps) {
  const t = useTranslations("Dashboard.calender");
  const locale = useLocale() as Locale;
  const { user, activeYear, setActiveYear } = useData();

  // set chart direction, initital value depends on screen size
  const [chartVertical, setChartVertical] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 640;
    }
    return false;
  });

  // filter the data by user and transform data to a format needed for the chart: data per day with the total duration
  const { uniqueDaysData, years } = useMemo(() => {
    // Filter by user
    const filteredByUser =
      user !== "all"
        ? activityData.filter((item) => item.user === user)
        : activityData;

    const rawDates: CalenderChartData[] = [];
    const years: number[] = [];

    // Iterate over raw data and extract day / duration / year and date object
    filteredByUser.forEach((item) => {
      const object = {
        day: item.date.toISOString().slice(0, 10),
        value: item.duration,
        year: item.date.getFullYear(),
        date: item.date,
      };
      rawDates.push(object);
    });

    // sum up the duration for each day
    const uniqueDaysData = rawDates.reduce((acc, item) => {
      const existingItem = acc.find((accItem) => accItem.day === item.day);
      if (existingItem) {
        existingItem.value += item.value;
      } else {
        acc.push(item);
      }
      return acc;
    }, [] as CalenderChartData[]);

    // round the duration to minutes
    uniqueDaysData.forEach((item) => {
      const existingYear = years.find((year) => year === item.year);
      if (!existingYear && item.year) {
        years.push(item.year);
      }
      item.value = Math.round(item.value / 60);
    });

    // sort the years (descending)
    years.sort((a, b) => b - a);

    return { uniqueDaysData, years };
  }, [activityData, user]);

  // filter years array if active year is selected
  const filteredYear: number = useMemo(() => {
    if (!activeYear) return years[0];
    return activeYear;
  }, [years, activeYear]);

  // create chart config (needed for year selector)
  const chartConfig = createChartConfig(years) satisfies ChartConfig;

  // get day with most minutes watched for given year, will be displayed in the header
  const mostPopularDay = useMemo(() => {
    return findHighestValueInYear(uniqueDaysData, filteredYear);
  }, [uniqueDaysData, filteredYear]);

  return (
    <>
      <Card className={cn("flex min-w-0 flex-col justify-center", className)}>
        {/* Card Header shows the most popular day of the year and a year selector */}
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          {mostPopularDay && (
            <div className="mr-5 grid gap-1">
              <CardTitle className="text-3xl sm:text-6xl">
                {mostPopularDay.date.toLocaleString(locale, {
                  day: "numeric",
                  month: "long",
                })}
              </CardTitle>
              <CardDescription>
                {t("description", { activeYear: filteredYear })}
              </CardDescription>
            </div>
          )}
          <SelectYear
            activeYear={activeYear}
            setActiveYear={setActiveYear}
            years={years}
            chartConfig={chartConfig}
            doNotRenderSelectAll
          />
        </CardHeader>

        {/* Card Content renders chart, initial direction depends on screen size */}
        <CardContent
          className={cn("flex h-[300px] justify-center pb-0", {
            "h-[600px]": chartVertical,
          })}
        >
          <ResponsiveCalendar
            direction={chartVertical ? "vertical" : "horizontal"}
            data={uniqueDaysData}
            from={`${filteredYear}-01-01`}
            to={`${filteredYear}-12-31`}
            emptyColor="hsl(var(--card))"
            tooltip={CalTooltip}
            colors={[
              "hsl(var(--chart-2) / 0.4)",
              "hsl(var(--chart-2) / 0.6)",
              "hsl(var(--chart-2) / 0.8)",
              "hsl(var(--chart-2))",
            ]}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            yearSpacing={40}
            monthBorderColor="hsl(var(--muted))"
            theme={theme} // custom theme as defined below
            dayBorderWidth={2}
            dayBorderColor="hsl(var(--muted))"
            legends={[
              {
                anchor: "bottom-right",
                direction: "row",
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: "right-to-left",
              },
            ]}
          />
        </CardContent>

        {/* Card Footer with button to change direction (vertical / horizontal) of chart */}
        <CardFooter>
          <Button
            variant={"ghost"}
            size={"icon"}
            title={t("rotate")}
            className="flex items-center justify-center gap-1"
            onClick={() => setChartVertical((prev) => !prev)}
          >
            <RxRotateCounterClockwise className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

// Custom tooltip
const CalTooltip = ({ day, value, color }: CalendarTooltipProps) => {
  const locale = useLocale() as Locale;
  const t = useTranslations("Dashboard.calender");

  const date = new Date(day);
  const formattedDate = date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
  });

  return (
    <BasicTooltip
      id={formattedDate}
      format={(value) => `${value} ${t("minutes", { count: value })}`}
      value={value}
      color={color}
      enableChip
    />
  );
};

// chart theme settings
const theme = {
  text: {
    fontSize: 11,
    fill: "hsl(var(--foreground))",
  },
  tooltip: {
    wrapper: {},
    container: {
      background: "hsl(var(--background))",
      color: "hls(var(--muted-foreground))",
      borderColor: "hsl(var(--border) / 0.5)",
      borderStyle: "solid",
      borderWidth: 1,

      fontSize: 12,
      borderRadius: 12,
      boxShadow:
        "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
    },
    basic: {},
    chip: {},
    table: {},
    tableCell: {},
    tableCellValue: {},
  },
};

// chart config for year selector
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

// find the most popular day in Arry of CalenderChartData
const findHighestValueInYear = (
  data: CalenderChartData[],
  specificYear: number,
): CalenderChartData | undefined => {
  return data
    .filter((obj) => obj.year === specificYear) // Filter objects for the specific year
    .reduce<CalenderChartData | undefined>((maxObj, current) => {
      return maxObj && maxObj.value > current.value ? maxObj : current;
    }, undefined);
};
