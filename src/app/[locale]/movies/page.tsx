"use client";

import { useData } from "@/context/DataProvider";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import MoviesOrSeriesGrid from "../../../components/layouts/MoviesOrSeriesGrid";
import { useStorage } from "@/hooks/useStorage";
import UserSelect from "@/components/selects/UserSelect";
import GenreSelect from "@/components/selects/GenreSelect";
import { useTranslations } from "next-intl";

import BackToTopButton from "@/components/ui/BackToTopButton";
import LoadingGrid from "./_components/LoadingGrid";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("Movies");
  const { hasStorageData, user } = useData();
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    undefined,
  );

  // if no storage data is available, redirect to upload page
  useEffect(() => {
    if (!router || !!hasStorageData) return;

    router.push("/upload");
  }, [router, hasStorageData]);

  // fetch movies from storage
  const { data: movies, isLoading, error } = useStorage("MY_MOVIES");

  // filter movies by user
  const moviesByUser = useMemo(() => {
    if (!user || user === "all") return movies;
    return movies?.filter((movie) => movie.user === user);
  }, [movies, user]);

  // filter movies by selected genre
  const filteredMovies = useMemo(() => {
    
    if (!selectedGenre) return moviesByUser;
    return moviesByUser?.filter((movie) =>
      movie.genres?.includes(selectedGenre),
    );
  }, [moviesByUser, selectedGenre]);

  if (isLoading) return <LoadingGrid />;
  if (error) return <div>Error: {error}</div>;
  if (!filteredMovies || !movies || !moviesByUser)
    return <div className="text-destructive">{t("notfound")}</div>;

  return (
    <article>
      <div className="sticky top-0 mt-4 flex justify-end gap-2 bg-background/85 py-2">
        <GenreSelect
          activityData={moviesByUser}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
        />
        <UserSelect />
      </div>
      <div className="mb-6 mt-4 items-start justify-center lg:mt-0 lg:flex lg:justify-between lg:gap-4">
        <div>
          <h1>{t("title")}</h1>
          <p className="mb-6 text-pretty">{t("description")}</p>
        </div>
      </div>

      <MoviesOrSeriesGrid
        data={filteredMovies}
        type="movies"
        setSelectedGenre={setSelectedGenre}
      />

      <BackToTopButton />
    </article>
  );
}
