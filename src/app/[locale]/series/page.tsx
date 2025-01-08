"use client";
import { useData } from "@/context/DataProvider";
import { useRouter } from "next/navigation";
import { useStorage } from "@/hooks/useStorage";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import MoviesOrSeriesGrid from "@/components/layouts/MoviesOrSeriesGrid";
import UserSelect from "@/components/selects/UserSelect";
import GenreSelect from "@/components/selects/GenreSelect";
import { TopTenSlider } from "@/components/layouts/TopTenSlider";
import BackToTopButton from "@/components/ui/BackToTopButton";
import LoadingGrid from "./_components/LoadingGrid";

import { EnrichedActivity } from "@/types/customTypes";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("Series");
  const { hasStorageData, user } = useData();
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    undefined,
  );

  // if no storage data is available, redirect to upload page
  useEffect(() => {
    if (!router || !!hasStorageData) return;

    router.push("/upload");
  }, [router, hasStorageData]);

  // fetch TV shows from storage
  const { data: tvShows, isLoading, error } = useStorage("MY_SERIES");

  // filter series by user
  const tvShowsByUser = useMemo(() => {
    if (!user || user === "all") return tvShows;
    return tvShows?.filter((movie) => movie.user === user);
  }, [tvShows, user]);

  // slice in top 10 and other
  const { top10TvShows, otherTvShows } = useMemo(() => {
    let otherTvShows: EnrichedActivity[] = [];
    let top10TvShows: EnrichedActivity[] = [];
    if (tvShowsByUser && tvShowsByUser.length >= 10) {
      top10TvShows = tvShowsByUser.slice(0, 10);
      otherTvShows = tvShowsByUser.slice(10);
    } else if (tvShowsByUser) {
      top10TvShows = tvShowsByUser;
    }

    return { top10TvShows, otherTvShows };
  }, [tvShowsByUser]);

  // filter other TV Show  by selected genre
  const otherTvShowsByGenre = useMemo(() => {
    if (!selectedGenre) return otherTvShows;
    return otherTvShows?.filter((show) => show.genres?.includes(selectedGenre));
  }, [otherTvShows, selectedGenre]);

  if (isLoading) return <LoadingGrid />;
  if (error) throw new Error(error);

  // handle the case where there are no TV shows for the selected user
  if (top10TvShows.length === 0 || !tvShowsByUser) {
    return (
      <>
        <div className="mt-4 flex justify-end gap-2 py-2">
          <UserSelect />
        </div>
        <div className="mb-6 items-start justify-center lg:flex lg:justify-between lg:gap-4">
          <div>
            <h1 className="mb-6 text-left text-3xl sm:text-4xl md:text-5xl">
              {t("title")}
            </h1>
            <p className="my-6 text-balance">{t("description")}</p>
          </div>
        </div>
        <div className="text-destructive">
          {tvShowsByUser ? t("noSeriesFoundForUser", { user }) : t("notfound")}
        </div>
      </>
    );
  }

  return (
    <>
      <section className="mb-6 mt-12">
        <h1 className="w-full">
          {t("toptitle", { count: top10TvShows.length })}
        </h1>

        <TopTenSlider topten={top10TvShows} />
      </section>

      {otherTvShows.length >= 1 && (
        <section>
          <div className="sticky top-0 my-6 flex justify-end gap-2 bg-background/85 py-2">
            <GenreSelect
              activityData={otherTvShows}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
            />
            <UserSelect />
          </div>
          <div className="mb-6 items-start justify-center lg:flex lg:justify-between lg:gap-4">
            <div>
              <h1>{t("othertitle")}</h1>
              <p className="my-3 text-balance">{t("description")}</p>
            </div>
          </div>
          <MoviesOrSeriesGrid
            data={otherTvShowsByGenre}
            type="tv"
            setSelectedGenre={setSelectedGenre}
          />
        </section>
      )}
      <BackToTopButton />
    </>
  );
}
