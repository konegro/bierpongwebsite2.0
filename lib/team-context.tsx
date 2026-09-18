"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

const STORAGE_KEY = "xenogenesis:teamId";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

type TeamContextValue = {
  teamId: string | null;
  setTeamId: (id: string) => void;
};

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const teamId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTeamId = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    // "storage" only fires in other tabs by default — dispatch it locally too
    // so useSyncExternalStore picks up the change in this tab.
    window.dispatchEvent(new StorageEvent("storage"));
  }, []);

  return <TeamContext.Provider value={{ teamId, setTeamId }}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within a TeamProvider");
  return ctx;
}
