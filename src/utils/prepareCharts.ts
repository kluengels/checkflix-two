// prepares data for DurationCharts

import { Locale } from "@/i18n/routing";
import { Activity, RawDate } from "@/types/customTypes";

/**
 * transforms raw activity data into a list of objects with year, month and day in local strings and duration, 
 * Expample output: [(year: 2021, month: "January", day: "Monday", duration: 120), ...]
 */
export default function createDateListFromActivityData(
  data: Activity[],
  locale: Locale,
  user: string,
) {

  const rawDates: RawDate[] = [];
  // Filter by user
  if(user !== "all") {
    data = data.filter((item) => item.user === user)
  }
  
  // Iterate over raw data and extract year / month / weekday and duration
  
  data.forEach((item) => {
    const object = {
      year: item.date.getFullYear(),
      month: item.date.toLocaleString(locale, { month: "long" }),
      day: item.date.toLocaleString(locale, { weekday: "long" }),
      duration: item.duration,
      date: item.date,
    };
    rawDates.push(object);
  });

  return rawDates;
}
