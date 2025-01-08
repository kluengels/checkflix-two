// Hooks to load data from indexedDB

import getErrorMessage from "@/utils/getErrorMessage";
import { Activity, EnrichedActivity, UserList } from "@/types/customTypes";
import { get, getMany } from "idb-keyval";
import { useState, useEffect } from "react";



/**
 * Hook to load data from indexedDB
 */
export function useStorage(key: "MY_SERIES"): {
  isLoading: boolean;
  data: EnrichedActivity[] | null;
  error: string | null;
};
export function useStorage(key: "MY_MOVIES"): {
  isLoading: boolean;
  data: EnrichedActivity[] | null;
  error: string | null;
};
export function useStorage(key: "MY_DATA"): {
  isLoading: boolean;
  data: Activity[] | null;
  error: string | null;
};
export function useStorage(key: "USERLIST"): {
  isLoading: boolean;
  data: UserList | null;
  error: string | null;
};


export function useStorage<T>(
  key: "MY_SERIES" | "MY_MOVIES" | "MY_DATA" | "USERLIST",
): {
  isLoading: boolean;
  data: T | null;
  error: string | null;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch data from indexedDB
        const dataFromStorage = await get<T>(key);
        setData(dataFromStorage ?? null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [key]);

  return { isLoading, data, error };
}

type StorageData = {
  series?: EnrichedActivity[];
  movies?: EnrichedActivity[];
  allData?: Activity[];
  userlist?: UserList;
};

/**
 * Hook to load multiple keys from indexedDB
 */
export function useStorageMany(
  keys: ("MY_SERIES" | "MY_MOVIES" | "MY_DATA" | "USERLIST")[],
) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<StorageData>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching data from storage
        const dataFromStorage = await getMany(keys);
        const results: StorageData = {};
        dataFromStorage.forEach((item, id) => {
          switch (keys[id]) {
            case "MY_SERIES":
              results.series = item as EnrichedActivity[];
              break;
            case "MY_MOVIES":
              results.movies = item as EnrichedActivity[];
              break;
            case "MY_DATA":
              results.allData = item as Activity[];
              break;
            case "USERLIST":
              results.userlist = item as UserList;
              break;
          }
        });

        setData(results);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(keys)]);

  return { isLoading, data, error };
}
