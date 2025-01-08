import { z } from "zod";

// Define the schema for the CSV data
export interface RowData {
  "Profile Name": string;
  "Start Time": string;
  Duration: string;
  Attributes: string;
  Title: string;
  "Supplemental Video Type": string;
  "Device Type": string;
  Bookmark: string;
  "Latest Bookmark": string;
  Country: string;
}

export const expectedHeaders = Object.keys({} as RowData) as (keyof RowData)[];

// Define the schema for the parsed data
export const activitySchema = z.object({
  user: z.string(),
  fulltitle: z.string(),
  type: z.union([z.literal("movie"), z.literal("series")]),
  date: z.date(),
  duration: z.number(),
});

export const enrichedActivitySchema = z.object({
  user: z.string(),
  title: z.string(),
  image: z.string().optional(),
  poster: z.string().optional(),
  genres: z.array(z.string()).optional(),
  summary: z.string().optional(),
  date: z.array(z.date()),
  duration: z.number(),
  results: z.array(z.object({})).optional(),
});

export type EnrichedActivity = z.infer<typeof enrichedActivitySchema>;

// Array of Activities schema
export const ActivitySchemaArray = z.array(activitySchema);

// Infer the type from the schema
export type Activity = z.infer<typeof activitySchema>;

export type ActivityFromDummyData = Omit<EnrichedActivity, "date"> & {
  date: string[];
};

// API Response schema

export const MovieSearchSchema = z.object({
  adult: z.boolean().default(true),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()),
  id: z.number().default(0),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number().default(0),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean().default(true),
  vote_average: z.number().default(0),
  vote_count: z.number().default(0),
});

export const MovieSearchSchemaArray = z.array(MovieSearchSchema);

export const ApiResponseSchemaMovieSearch = z.object({
  page: z.number().default(0),
  results: z.array(MovieSearchSchema),
  total_pages: z.number().default(0),
  total_results: z.number().default(0),
});

const TvShowSearchSchema = z.object({
  adult: z.boolean().default(true),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()),
  id: z.number().default(0),
  origin_country: z.array(z.string()),
  original_language: z.string(),
  original_name: z.string(),
  overview: z.string(),
  popularity: z.number().default(0),
  poster_path: z.string().nullable(),
  first_air_date: z.string(),
  name: z.string(),
  vote_average: z.number().default(0),
  vote_count: z.number().default(0),
});

export const TvShowSearchSchemaArray = z.array(TvShowSearchSchema);
export const ApiResponseSchemaTvShowSearch = z.object({
  page: z.number().default(0),
  results: z.array(TvShowSearchSchema),
  total_pages: z.number().default(0),
  total_results: z.number().default(0),
});

export type MovieSearchItem = z.infer<typeof MovieSearchSchema>;
export type MovieApiResponse = z.infer<typeof ApiResponseSchemaMovieSearch>;

export type TvShowSearchItem = z.infer<typeof TvShowSearchSchema>;
export type TvShowApiResponse = z.infer<typeof ApiResponseSchemaTvShowSearch>;

const GenreListItemSchema = z.object({
  name: z.string(),
  id: z.number().default(0),
});

export const GenreListSchemaArray = z.array(GenreListItemSchema);
export type GenreListItem = z.infer<typeof GenreListItemSchema>;

export const UserListSeschema = z.array(z.string());
export type UserList = z.infer<typeof UserListSeschema>;

export type RawDate = {
  year: number;
  month: string;
  day: string;
  duration: number;
  date: Date;
};

export type CalenderChartData = {
  day: string; // format must be YYYY-MM-DD
  value: number;
  year?: number;
  date: Date;
};

export type YearChartData = {
  year: number;
  duration: number;
}[];

export type WeekdayChartData = {
  day: string;
  [year: number]: number;
};

export type MonthChartData = {
  month: string;
  [year: number]: number;
};
