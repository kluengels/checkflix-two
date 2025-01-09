"use client";
import { useEffect } from "react";
import { useData } from "@/context/DataProvider";
import { useStorageMany } from "@/hooks/useStorage";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

// Dynamically import charts
const UsersCard = dynamic(() => import("@/components/layouts/UsersCard"), {
  ssr: false,
  loading: () => <Skeleton className="h-[150px] w-full sm:col-span-12" />,
});
const YearsCard = dynamic(() => import("@/components/charts/YearsCard"), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-[400px] w-full sm:col-span-12 xl:col-span-8" />
  ),
});
const GenresCard = dynamic(() => import("@/components/charts/GenresCard"), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full sm:col-span-6" />,
});
const TopSeriesCard = dynamic(
  () => import("@/components/charts/TopSeriesCard"),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-[400px] w-full sm:col-span-12 xl:col-span-4" />
    ),
  },
);
const WeekdaysCard = dynamic(() => import("@/components/charts/WeekDaysCard"), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-[300px] w-full sm:col-span-12 lg:col-span-5" />
  ),
});
const MonthCard = dynamic(() => import("@/components/charts/MonthsCard"), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-[300px] w-full sm:col-span-12 lg:col-span-7" />
  ),
});
const CalenderCard = dynamic(() => import("@/components/charts/CalenderCard"), {
  ssr: false,
  loading: () => <Skeleton className="h-[200px] w-full sm:col-span-12" />,
});

import LoadingGrid from "./_components/LoadingGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const t = useTranslations("Dashboard.noData");
  const router = useRouter();
  const { hasStorageData } = useData();

  // if no storage data is available, redirect to upload page
  useEffect(() => {
    if (!router || !!hasStorageData) return;
    router.push("/upload");
  }, [router, hasStorageData]);

  // fetch userlist, alldata, movies and series from storage
  const {
    data: { allData, series, movies, userlist } = {},
    isLoading,
    error,
  } = useStorageMany(["MY_DATA", "MY_SERIES", "MY_MOVIES", "USERLIST"]);

  if (isLoading) {
    return <LoadingGrid />;
  }
  if (error) {
    return <div>{error}</div>;
  }

  if (!allData || allData.length < 1 || !series || !movies || !userlist)
    return (
      <>
        <h1>{t("title")}</h1>
        <p>
          <Button onClick={() => router.push("/upload")}></Button>
        </p>
      </>
    );

  return (
    <article className="grid gap-5 sm:grid-cols-12">
      <UsersCard userlist={userlist} className="sm:col-span-12" />
      <YearsCard
        activityData={allData}
        className="sm:col-span-12 lg:col-span-8"
      />
      <TopSeriesCard
        activityData={series}
        className="sm:col-span-12 lg:col-span-4"
      />
      <WeekdaysCard
        activityData={allData}
        className="sm:col-span-12 lg:col-span-5"
      />

      <MonthCard
        activityData={allData}
        className="sm:col-span-12 lg:col-span-7"
      />

      {series.length > 0 && (
        <GenresCard activityData={series} type="tv" className="sm:col-span-6" />
      )}
      {movies.length > 0 && (
        <GenresCard
          activityData={movies}
          type="movies"
          className="sm:col-span-6"
        />
      )}

      <CalenderCard activityData={allData} className="md:col-span-12" />
    </article>
  );
}
