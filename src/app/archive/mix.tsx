"use client";

import { useContext } from "react";

import { NowPlayingContext } from "@/components/now-playing-provider";

export function Mix({ name, url }: { name: string; url: string }) {
  const { setPlaying, setMixcloudIframeUrl } = useContext(NowPlayingContext);
  const mixcloudIframeUrl = `https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(
    url
  )}&hide_cover=1&mini=1&light=1&autoplay=1`;
  return (
    <button
      onClick={async () => {
        setPlaying(false);
        setMixcloudIframeUrl(mixcloudIframeUrl);
        // @ts-expect-error TODO: Add Mixcloud as global var
        const widget = window.Mixcloud.PlayerWidget(
          document.getElementById("mixcloud-iframe")
        );
        await widget.ready;
        await widget.load(url);
      }}
    >
      {name}
    </button>
  );
}
