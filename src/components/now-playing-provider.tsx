"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { fetchShows, Show } from "@/api";

type Player = "stream-1" | "stream-2" | "mixcloud";

const defaultMixcloudIframeUrl =
  "https://www.mixcloud.com/widget/iframe/?feed=https%3A%2F%2Fwww.mixcloud.com%2FDublinDigitalRadio%2Fgetting-away-with-it-25th-february-2017%2F&hide_cover=1&mini=1&light=1";

export const NowPlayingContext = createContext<{
  activePlayer?: Player;
  setActivePlayer: Dispatch<SetStateAction<Player | undefined>>;
  currentShow?: Show;
  nextShow?: Show;
  mixcloudIframeUrl: string;
  setMixcloudIframeUrl: Dispatch<SetStateAction<string>>;
}>({
  setActivePlayer: () => {},
  currentShow: undefined,
  nextShow: undefined,
  mixcloudIframeUrl: defaultMixcloudIframeUrl,
  setMixcloudIframeUrl: () => {},
});

export function NowPlayingProvider({
  initNextShow,
  children,
}: {
  initNextShow?: Show;
  children: React.ReactNode;
}) {
  const [activePlayer, setActivePlayer] = useState<Player | undefined>();
  const [currentShow, setCurrentShow] = useState<Show | undefined>();
  const [nextShow, setNextShow] = useState<Show | undefined>(initNextShow);
  const [mixcloudIframeUrl, setMixcloudIframeUrl] = useState(
    defaultMixcloudIframeUrl
  );

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
        activePlayer,
        setActivePlayer,
        currentShow,
        nextShow,
        mixcloudIframeUrl,
        setMixcloudIframeUrl,
      }}
    >
      {children}
    </NowPlayingContext.Provider>
  );
}
