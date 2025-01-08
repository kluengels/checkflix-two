/**
 * get the first and last year from watch dates array
 */
export function getFirstAndLastYear(dates: Date[]) {
    // clone array
    const datesSorted = dates.map((x) => x);
  
    // sort dates in ascending order: earliest date first
    datesSorted.sort();
  
    // set first date as default
    const firstYear = datesSorted[0].getFullYear();
    const lastYear = datesSorted[datesSorted.length - 1].getFullYear();
  
    return { firstYear, lastYear };
  }
  

  /**
 * get the latest watche date, ignore dates that are too close to each other (which probably means the user paused the movie)
 */
export function getLatestWatchedDate(dates: Date[]) {
    // clone array
    const datesSorted = dates.map((x) => x);
  
    // sort dates in descending order: latest date first
    datesSorted.sort((a, b) => b.getTime() - a.getTime());
  
    // set first date as default
    let lastWatched = datesSorted.pop();
  
    // callenge: If the user paused the movie late in the evening and contiued watching it later, the next date can be on a different date technically, but should be considered as the same day
  
    datesSorted.forEach((date) => {
      if (!!lastWatched && date > lastWatched) {
        // if the date is more than 2 hours after midnight, it is considered as a new day
        // also chheck if the  if the difference to the last date is more than 4 hours
        if (
          hoursFromMidnight(date) > 2 &&
          date.getTime() - lastWatched.getTime() > 4 * 60 * 60 * 1000
        ) {
          lastWatched = date;
        }
      }
    });
    return lastWatched;
  }
  
  /**
   * calculate the hours from midnight
   */
  function hoursFromMidnight(date: Date): number {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    // Convert everything to fractional hours
    return hours + minutes / 60 + seconds / 3600;
  }
  