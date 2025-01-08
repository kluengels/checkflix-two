"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { keys } from "idb-keyval";

const DataContext = createContext<{
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
  hasStorageData: boolean;
  setHasStorageData: React.Dispatch<React.SetStateAction<boolean>>;
  activeYear: number | undefined | null;
  setActiveYear: React.Dispatch<React.SetStateAction<number | undefined | null>>;
}>({
  user: "all",
  setUser: () => {},
  hasStorageData: true,
  setHasStorageData: () => {},
  activeYear: undefined,
  setActiveYear: () => {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string>("all");
  const [hasStorageData, setHasStorageData] = useState<boolean>(true);
  const [activeYear, setActiveYear] = useState<number | undefined | null>(undefined);

  useEffect(() => {
    const checkStorage = async () => {
      // fetch all keys from indexedDB
      const storageKeys = await keys();

      // Check if expected keys are in storage
      const expectedKeys = ["MY_DATA", "MY_SERIES", "MY_MOVIES", "USERLIST"];
      setHasStorageData(expectedKeys.every((key) => storageKeys.includes(key)));
    };

    checkStorage();
  }, []);

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        hasStorageData,
        setHasStorageData,
        activeYear,
        setActiveYear,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
