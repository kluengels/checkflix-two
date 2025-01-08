// add details from the movie database to movie / tv show data
"use server";
import { getTranslations } from "next-intl/server";
import getErrorMessage from "@/utils/getErrorMessage";
import {
  EnrichedActivity,
  GenreListItem,
  GenreListSchemaArray,
  MovieSearchItem,
  TvShowSearchItem,
} from "../types/customTypes";

// Options for the fetch request to the movie DB
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_TMDB_API_KEY!}`,
  },
};

/**
 * Enrich the data with details from the movie DB (Sever action)
 * @param data movie / tv show data
 * @param lang language of request
 * @param type can be either "movie" or "tv"
 * @returns Promise with enriched data for movie / tv shows or error
 */
export default async function enrichData(
  data: EnrichedActivity[],
  lang: "de" | "en",
  type: "movie" | "tv",
) {
  const t = await getTranslations("Errors");
  // exit early if no data
  if (data.length === 0) return { data: [], error: null };

  try {
    // check if Api key is set
    if (!process.env.NEXT_TMDB_API_KEY) {
      throw new Error("NEXT_TMDB_API_KEY is not defined");
    }

    // fetch genre names from movie DB
    const { data: genreList, error: genreError } = await fetchGenreNames(
      lang,
      type,
    );
    if (genreError) throw genreError;
    if (!genreList || genreList.length < 1)
      throw new Error(t("genreFetchError"));

    // enrich data with details from the movie DB
    // not using Promise.all to avoid rate limiting

    const enrichedData: EnrichedActivity[] = [];
    for (const item of data) {
      const { data: dataFromImdb, error } = await fetchDetails(
        item.title,
        type,
        lang,
        genreList,
      );

      // if there is an error, return the original item
      if (error || !dataFromImdb) {
        enrichedData.push(item);
      } else {
        enrichedData.push({ ...item, ...dataFromImdb });
      }
    }

    // delay for 100 milliseconds to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));

    return { data: enrichedData, error: null };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(t("detailsError"), errorMessage);
    return { data: null, error: error };
  }
}

/**
 * Fetch genre Names from the movie DB
 * @param lang language of request
 * @param type can be either "movie" or "tv"
 * @returns list of genres with id and name
 */
async function fetchGenreNames(lang: "de" | "en", type: "movie" | "tv") {
  const t = await getTranslations("Errors");
  try {
    // fetch genre list from movie DB
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/${type}/list?language=${lang}`,
      options,
    );
    if (!response.ok)
      throw new Error(t("genreFetchError") + ` Status: ${response.status}`);
    const result = await response.json();
    if (!result.genres) throw new Error(t("genreFetchError"));
    const results = result.genres as GenreListItem[];

    // validate results against zod schema
    const { data: validatedData, error: validationError } =
      GenreListSchemaArray.safeParse(results);
    if (validationError) throw validationError;
    if (validatedData.length === 0) throw new Error(t("genreFetchError"));

    return { data: validatedData, error: null };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Fetch details for a movie or tv show from the movie DB
 * @param title title of the movie / tv show
 * @param type can be either "movie" or "tv"
 * @param lang language of request
 * @returns Promise with genre names, image url and summary or error
 */
async function fetchDetails(
  title: string,
  type: "movie" | "tv",
  lang: "de" | "en",
  genreList: GenreListItem[],
) {
  // booelean operator to check if type is movie, otherwise it is a tv show
  const isMovie = type === "movie";

  try {
    // fetch details from movie DB
    const response = await fetch(
      `https://api.themoviedb.org/3/search/${type}?query=${encodeURI(title)}&include_adult=false&language=${lang}`,
      options,
    );
    if (!response.ok)
      throw new Error(
        `Request for type "${type}" and title "${title}" failed with status: ${response.status}`,
      );
    const result = await response.json();
    if (!result.results) throw new Error("No results found");

    let results = isMovie
      ? (result.results as MovieSearchItem[])
      : (result.results as TvShowSearchItem[]);

    //sort by vote count: assume that the most popular result is the correct one
    results = results.sort(
      (a, b) => Number(b.vote_count) - Number(a.vote_count),
    );

    // continue with best result
    const bestResult = results[0];

    // generate list with genre names
    const genreIds = bestResult.genre_ids;
    const genres: string[] = [];

    // look up genre names
    genreIds?.forEach((id) => {
      const genre = genreList?.find((genre) => genre.id === id);
      if (genre) {
        genres.push(genre.name);
      }
    });

    // get image url
    const imageURL = bestResult.backdrop_path || undefined;

    // get poster url as fallback
    const poster = bestResult.poster_path || undefined;

    // get description
    const summary = bestResult.overview;

    // return genre names, image url, summary and poster url
    return {
      error: null,
      data: { genres, image: imageURL, summary, poster, results },
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return { data: null, error: errorMessage };
  }
}
