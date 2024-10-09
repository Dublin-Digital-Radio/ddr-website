"use client";

import { useContext } from "react";

import { NowPlayingContext } from "@/components/now-playing-provider";

export function MixcloudPlayer() {
  const { mixcloudIframeUrl, activePlayer } = useContext(NowPlayingContext);
  return (
    <iframe
      id="mixcloud-iframe"
      frameBorder="0"
      height="60"
      width="100%"
      allow="autoplay"
      src={mixcloudIframeUrl}
      className={activePlayer === 'mixcloud' ? 'h-auto' : 'h-0'}
    />
  );
}
