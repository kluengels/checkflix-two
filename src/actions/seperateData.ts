import { Activity, EnrichedActivity } from "../types/customTypes";

/**
 * Special function to seperate movies and tv shows from the parsed data
 * @param data parsed data
 * @returns seperated data, sorted by title (movies) or duration (tv shows), does not include entries with less than 15 min. (movies) or 30 min. (tv shows) watchtime in total
 */
export default function seperateData(data: Activity[]) {
  let movieData: EnrichedActivity[] = [];
  let tvShowData: EnrichedActivity[] = [];

  data.forEach((item) => {
    // select movies from parsed data
    if (item["type"] === "movie") {
      const index = movieData.findIndex((e) => e.title === item["fulltitle"]);

      // if movie is already in list...
      if (index > -1) {
        const entry = movieData[index];

        // ...add duration to existing object
        entry["duration"] += item["duration"];

        // ..add date to existing object
        entry["date"]?.push(item["date"]);
      } else {
        // Otherwise create new object
        const entry = {
          user: item[`user`],
          title: item["fulltitle"],
          date: [item[`date`]],
          duration: item[`duration`],
        };

        // add to new array
        movieData.push(entry);
      }

      // select tv shows from parsed data
    } else {
      const index = tvShowData.findIndex(
        (e) => e.title === item["fulltitle"].split(":")[0],
      );

      // if TV show is already in list...
      if (index > -1) {
        const entry = tvShowData[index];

        //... add duration and watch date to existing object
        entry["duration"] += item["duration"];
        entry["date"]?.push(item["date"]);

        // Otherwise create new object
      } else {
        const entry = {
          user: item[`user`],
          title: item["fulltitle"].split(":")[0],
          date: [item[`date`]],
          duration: item[`duration`],
        };

        // add to new array
        tvShowData.push(entry);
      }
    } //}
  });

  // remove all movies that have been watched for less than 15 min.
  movieData = movieData.filter((item) => item.duration >= 900);

  // remove all series that have been watched for less than 30 min.

  tvShowData = tvShowData.filter((item) => item.duration >= 1800);

  // sort movies by title
  movieData.sort((a, b) => (a.title > b.title ? 1 : -1));

  // sort tv shows by duration
  tvShowData.sort((a, b) => (a.duration < b.duration ? 1 : -1));

  return { movieData, tvShowData };
}
