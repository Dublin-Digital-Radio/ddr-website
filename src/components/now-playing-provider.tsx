"use client";

import { createContext, useEffect, useState } from "react";

import { fetchShows, Show } from "@/api";

export const NowPlayingContext = createContext<{
  currentShow?: Show;
  nextShow?: Show;
}>({
  currentShow: undefined,
  nextShow: undefined,
});

export function NowPlayingProvider({
  initCurrentShow,
  initNextShow,
  children,
}: {
  initCurrentShow?: Show;
  initNextShow?: Show;
  children: React.ReactNode;
}) {
  const [currentShow, setCurrentShow] = useState<Show | undefined>(
    initCurrentShow
  );
  const [nextShow, setNextShow] = useState<Show | undefined>(initNextShow);

  const fetchAndSetCurrentShowTitle = async () => {
    const shows = await fetchShows();
    setCurrentShow(shows.current);
    setNextShow(shows.next);
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
        nextShow,
      }}
    >
      {children}
    </NowPlayingContext.Provider>
  );
}
