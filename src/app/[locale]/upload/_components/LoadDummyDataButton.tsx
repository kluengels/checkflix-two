import { Locale, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useData } from "@/context/DataProvider";
import { setMany } from "idb-keyval";

// import dummyData proviced as json-files from lib
import allDataInt from "@/lib/dummydata/allDataCleaned.json";
import movieData from "@/lib/dummydata/en/movies.json";
import seriesData from "@/lib/dummydata/en/series.json";
import movieDataDE from "@/lib/dummydata/de/movies.json";
import seriesDataDE from "@/lib/dummydata/de/series.json";

import { Button } from "@/components/ui/button";

import { Dispatch, SetStateAction } from "react";
import { Activity, ActivityFromDummyData } from "@/types/customTypes";

interface LoadDummyDataButtonProps {
  setError: Dispatch<SetStateAction<string | null>>;
  setPending: Dispatch<SetStateAction<boolean>>;
}

/**
 * Button to load dummy data into the indexedDB
 * @param setError - function to set an error message
 * @param setPending - function to set the pending state
 * @returns Button to load dummy data
 */
export default function LoadDummyDataButton({
  setError,
  setPending,
}: LoadDummyDataButtonProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Upload");
  const router = useRouter();
  const localeIsDE = locale === "de";
  const { setHasStorageData } = useData();

  // parse all raw data file to get the correct date formats
  const allDataParsed = allDataInt.map((item) => {
    return {
      ...item,
      date: new Date(item.date),
      type: item.type as "series" | "movie",
    };
  });

  const movieDataDEparsed = parseEnrichedActivityData(movieDataDE);
  const seriesDataDEparsed = parseEnrichedActivityData(seriesDataDE);
  const movieDataParsed = parseEnrichedActivityData(movieData);
  const seriesDataParsed = parseEnrichedActivityData(seriesData);

  // load dummy data into the indexedDB, depending on the locale
  async function loadDummydata() {
    setPending(true);

    await setMany([
      ["MY_DATA", allDataParsed],
      ["MY_MOVIES", localeIsDE ? movieDataDEparsed : movieDataParsed],
      ["MY_SERIES", localeIsDE ? seriesDataDEparsed : seriesDataParsed],
      ["USERLIST", createUserList(allDataParsed)],
    ])
      .then(() => {
        setHasStorageData(true);
        router.push("/dashboard");
      })
      .catch((err) => {
        console.error(err);
        setError(t("errorLoadingDummyData"));
      })
      .finally(() => {
        setPending(false);
      });
  }

  return (
    <Button variant="link" onClick={loadDummydata} className="max-w-full">
      <span className="whitespace-normal break-words">
        {t("loadDummyDataButton")}
      </span>
    </Button>
  );
}

/**
 * Create a list of all unique users from the activity data
 */

function createUserList(data: Activity[]) {
  const userArray: string[] = [];
  data.forEach((item) => {
    if (!userArray.includes(item.user)) {
      userArray.push(item.user);
    }
  });

  return userArray;
}

/**
 * Parse raw data from the dummy data files to the correct format of dates
 */
function parseEnrichedActivityData(activityData: ActivityFromDummyData[]) {
  return activityData.map((item) => ({
    ...item,
    date: item.date.map((date) => new Date(date)),
  }));
}
