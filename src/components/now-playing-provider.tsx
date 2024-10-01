"use client";

import { createContext, useEffect, useState } from "react";

import { fetchShows, Show } from "@/api";

export const NowPlayingContext = createContext<{
  currentShow?: Show;
}>({
  currentShow: undefined,
});

export function NowPlayingProvider({
  initCurrentShow,
  children,
}: {
  initCurrentShow?: Show;
  children: React.ReactNode;
}) {
  const [currentShow, setCurrentShow] = useState<Show | undefined>(
    initCurrentShow
  );

  const fetchAndSetCurrentShowTitle = async () => {
    const shows = await fetchShows();
    setCurrentShow(shows.current);
  };

  useEffect(() => {
    fetchAndSetCurrentShowTitle();
    setInterval(async () => {
      fetchAndSetCurrentShowTitle();
    }, 60 * 1000);
  }, []);

  return (
    <NowPlayingContext.Provider
      value={{
        currentShow,
      }}
    >
      {children}
    </NowPlayingContext.Provider>
  );
}
