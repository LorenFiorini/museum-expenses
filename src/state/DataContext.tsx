import React, { createContext, useContext, useMemo, useState } from "react";
import { GiftEntry, ExpenseEntry, ParsedPayload } from "../types";
import { loadFromStorage, persistToStorage } from "../utils/storage";

type DataState = {
  expenses: ExpenseEntry[];
  gifts: GiftEntry[];
  dataReady: boolean;
  setData: (payload: ParsedPayload) => void;
  clearData: () => void;
};

const DataContext = createContext<DataState | undefined>(undefined);

const STORAGE_KEY = "museum-exec-dashboard-data";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ParsedPayload>(() =>
    loadFromStorage<ParsedPayload>(STORAGE_KEY, { expenses: [], gifts: [] })
  );

  const value = useMemo<DataState>(
    () => ({
      expenses: state.expenses,
      gifts: state.gifts,
      dataReady: state.expenses.length > 0 || state.gifts.length > 0,
      setData: (payload) => {
        setState(payload);
        persistToStorage(STORAGE_KEY, payload);
      },
      clearData: () => {
        setState({ expenses: [], gifts: [] });
        persistToStorage(STORAGE_KEY, { expenses: [], gifts: [] });
      }
    }),
    [state]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("DataContext missing");
  }
  return ctx;
}

