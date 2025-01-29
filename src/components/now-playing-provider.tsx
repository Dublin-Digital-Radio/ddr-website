"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { fetchRadioCultLiveShow, fetchRadioCultToggle, Show } from "@/api";

type Player = "stream-1" | "stream-2" | "mixcloud";

const airtimeStreamUrl =
  "https://dublindigitalradio.out.airtime.pro/dublindigitalradio_a";
const radioCultStreamUrl = "https://dublin-digital-radio.radiocult.fm/stream";
const defaultMixcloudIframeUrl =
  "https://www.mixcloud.com/widget/iframe/?feed=https%3A%2F%2Fwww.mixcloud.com%2FDublinDigitalRadio%2Fgetting-away-with-it-25th-february-2017%2F&hide_cover=1&mini=1&light=1";

export const NowPlayingContext = createContext<{
  scheduledStreamUrl?: string;
  activePlayer?: Player;
  setActivePlayer: Dispatch<SetStateAction<Player | undefined>>;
  currentShow?: Show | null;
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
  const [scheduledStreamUrl, setScheduledStreamUrl] = useState<string>();
  const [activePlayer, setActivePlayer] = useState<Player | undefined>();
  const [currentShow, setCurrentShow] = useState<Show | null | undefined>();
  const [mixcloudIframeUrl, setMixcloudIframeUrl] = useState(
    defaultMixcloudIframeUrl
  );

  const fetchAndSetCurrentShowTitle = async () => {
    const liveShow = await fetchRadioCultLiveShow();
    setCurrentShow(liveShow);
  };

  useEffect(() => {
    fetchRadioCultToggle().then((radioCultToggle) => {
      if (radioCultToggle) {
        setScheduledStreamUrl(radioCultStreamUrl);
      } else {
        setScheduledStreamUrl(airtimeStreamUrl);
      }
    });
    fetchAndSetCurrentShowTitle();
    setInterval(async () => {
      fetchAndSetCurrentShowTitle();
    }, 60 * 1000);
  }, []);

  return (
    <NowPlayingContext.Provider
      value={{
        scheduledStreamUrl,
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
