"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { fetchRadioCultLiveShow, Show } from "@/api";

type Player = "stream-1" | "stream-2" | "mixcloud";

const defaultMixcloudIframeUrl =
  "https://www.mixcloud.com/widget/iframe/?feed=https%3A%2F%2Fwww.mixcloud.com%2FDublinDigitalRadio%2Fgetting-away-with-it-25th-february-2017%2F&hide_cover=1&mini=1&light=1";

export const NowPlayingContext = createContext<{
  activePlayer?: Player;
  setActivePlayer: Dispatch<SetStateAction<Player | undefined>>;
  currentShow?: Show;
  mixcloudIframeUrl: string;
  setMixcloudIframeUrl: Dispatch<SetStateAction<string>>;
}>({
  setActivePlayer: () => {},
  currentShow: undefined,
  mixcloudIframeUrl: defaultMixcloudIframeUrl,
  setMixcloudIframeUrl: () => {},
});

export function NowPlayingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activePlayer, setActivePlayer] = useState<Player | undefined>();
  const [currentShow, setCurrentShow] = useState<Show | undefined>();
  const [mixcloudIframeUrl, setMixcloudIframeUrl] = useState(
    defaultMixcloudIframeUrl
  );

  const fetchAndSetCurrentShowTitle = async () => {
    const liveShow = await fetchRadioCultLiveShow();
    setCurrentShow({
      ...liveShow,
      name: "Afrogrunk",
      imageUrl:
        "http://res.cloudinary.com/dhikr416c/image/upload/v1599136152/whj0ihlzmakcjpid5m6a.jpg",
    });
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
        mixcloudIframeUrl,
        setMixcloudIframeUrl,
      }}
    >
      {children}
    </NowPlayingContext.Provider>
  );
}
