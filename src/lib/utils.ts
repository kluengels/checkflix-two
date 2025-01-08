import { clsx, type ClassValue } from "clsx";
import { keys } from "idb-keyval";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if the expected keys are in the indexedDB, used to protect routes
 */
export async function checkStorage() {
  // fetch all keys from indexedDB
  const storageKeys = await keys();

  // Check if expected keys are in storage
  const expectedKeys = ["MY_DATA", "MY_SERIES", "MY_MOVIES", "USERLIST"];
  return expectedKeys.every((key) => storageKeys.includes(key));
}
