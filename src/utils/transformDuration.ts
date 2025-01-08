export function hoursFromSeconds(seconds: number): number {
  return Math.round(seconds / 60 / 60);
}
export function minutesFromSeconds(seconds: number): number {
  return Math.round(seconds / 60);
}
export function daysFromSeconds(seconds: number): number {
  return Math.round(seconds / 60 / 60 / 24);
}

