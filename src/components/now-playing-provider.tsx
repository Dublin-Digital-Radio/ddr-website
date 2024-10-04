"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { fetchShows, Show } from "@/api";

const defaultMixcloudIframeUrl =
  "https://www.mixcloud.com/widget/iframe/?feed=https%3A%2F%2Fwww.mixcloud.com%2FDublinDigitalRadio%2Fgetting-away-with-it-25th-february-2017%2F&hide_cover=1&mini=1&light=1";

export const NowPlayingContext = createContext<{
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  currentShow?: Show;
  nextShow?: Show;
  mixcloudIframeUrl: string;
  setMixcloudIframeUrl: Dispatch<SetStateAction<string>>;
}>({
  playing: false,
  setPlaying: () => {},
  currentShow: undefined,
  nextShow: undefined,
  mixcloudIframeUrl: defaultMixcloudIframeUrl,
  setMixcloudIframeUrl: () => {},
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
  const [playing, setPlaying] = useState(false);
  const [currentShow, setCurrentShow] = useState<Show | undefined>(
    initCurrentShow
  );
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
        playing,
        setPlaying,
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
