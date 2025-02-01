"use client";

import { useContext, useEffect } from "react";

import { NowPlayingContext } from "@/components/now-playing-provider";

export function MixcloudPlayer() {
  const { mixcloudIframeUrl, activePlayer } = useContext(NowPlayingContext);

  useEffect(() => {
    if (activePlayer && activePlayer !== "mixcloud") {
      // @ts-expect-error TODO: Add Mixcloud as global var
      const widget = window.Mixcloud.PlayerWidget(
        document.getElementById("mixcloud-iframe"),
      );
      widget.ready.then(() => {
        widget.pause();
      });
    }
  }, [activePlayer]);

  return (
    <div
      className={`fixed bottom-0 w-full ${
        activePlayer === "mixcloud" && "h-[60px]"
      }`}
    >
      <iframe
        id="mixcloud-iframe"
        frameBorder="0"
        height="60"
        width="100%"
        allow="autoplay"
        src={mixcloudIframeUrl}
        className={activePlayer === "mixcloud" ? "h-auto" : "h-0"}
      />
    </div>
  );
}
