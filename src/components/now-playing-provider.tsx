"use client";

import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  fetchLiveEventStreamConfig,
  fetchRadioCultLiveShow,
  fetchRadioCultToggle,
  Show,
} from "@/api";

type Player = "stream-1" | "stream-2" | "mixcloud";

interface LiveEventStream {
  title: string;
  description?: string;
  url: string;
}

const airtimeStreamUrl =
  "https://dublindigitalradio.out.airtime.pro/dublindigitalradio_a";
const radioCultStreamUrl = "https://dublin-digital-radio.radiocult.fm/stream";
const defaultLiveEventStreamUrl =
  "https://stream2.dublindigitalradio.com:8001/stream";
const defaultMixcloudIframeUrl =
  "https://www.mixcloud.com/widget/iframe/?feed=https%3A%2F%2Fwww.mixcloud.com%2FDublinDigitalRadio%2Fgetting-away-with-it-25th-february-2017%2F&hide_cover=1&mini=1&light=1";

export const NowPlayingContext = createContext<{
  scheduledStreamUrl?: string;
  activePlayer?: Player;
  setActivePlayer: Dispatch<SetStateAction<Player | undefined>>;
  currentShow?: Show | null;
  liveEventStream?: LiveEventStream;
  liveEventStreamDialogRef?: RefObject<HTMLDialogElement | null>;
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
  const [liveEventStream, setLiveEventStream] = useState<
    LiveEventStream | undefined
  >();
  const [mixcloudIframeUrl, setMixcloudIframeUrl] = useState(
    defaultMixcloudIframeUrl,
  );

  const liveEventStreamDialogRef = useRef<HTMLDialogElement | null>(null);

  const fetchAndSetCurrentShowTitle = async () => {
    const liveShow = await fetchRadioCultLiveShow();
    setCurrentShow(liveShow);
  };

  const fetchAndSetLiveEventStreamConfig = async () => {
    const liveEventStreamConfig = await fetchLiveEventStreamConfig();
    setLiveEventStream(
      liveEventStreamConfig.playerEnabled
        ? {
            title: liveEventStreamConfig.Title,
            description: liveEventStreamConfig.description,
            url: liveEventStreamConfig.url ?? defaultLiveEventStreamUrl,
          }
        : undefined,
    );
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
    fetchAndSetLiveEventStreamConfig();
    const intervalId = setInterval(async () => {
      fetchAndSetCurrentShowTitle();
      fetchAndSetLiveEventStreamConfig();
    }, 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <NowPlayingContext.Provider
      value={{
        scheduledStreamUrl,
        activePlayer,
        setActivePlayer,
        currentShow,
        liveEventStream,
        liveEventStreamDialogRef,
        mixcloudIframeUrl,
        setMixcloudIframeUrl,
      }}
    >
      {children}
    </NowPlayingContext.Provider>
  );
}
