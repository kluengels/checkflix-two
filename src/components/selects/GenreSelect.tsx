"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EnrichedActivity } from "@/types/customTypes";

interface GenreSelectProps {
  activityData: EnrichedActivity[];
  selectedGenre: string | undefined;
  setSelectedGenre: Dispatch<SetStateAction<string | undefined>>;
}

/**
 * Renders a Select to switch between genres.
 */
export default function GenreSelect({
  activityData,
  selectedGenre,
  setSelectedGenre,
}: GenreSelectProps) {
  const t = useTranslations("Select.genre");

  const genres = useMemo(() => {
    // get all genres from all activities
    const genresRawData = activityData

      .map((activity) => activity.genres)
      .flat()
      .filter((genre): genre is string => genre !== undefined);
    // remove duplicates and sort
    return Array.from(new Set(genresRawData)).sort();
  }, [activityData]);

  if (!genres || genres.length < 2) return null;

  return (
    <>
      <Select
        key={"genre-select" + selectedGenre}
        value={selectedGenre}
        onValueChange={setSelectedGenre}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("resetselection")} />
        </SelectTrigger>
        <SelectContent>
          {genres?.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
          {!!selectedGenre && (
            <>
              <SelectSeparator />
              <SelectItem
                aria-label={t("resetselection")}
                value={undefined as never}
              >
                {t("resetselection")}
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </>
  );
}
