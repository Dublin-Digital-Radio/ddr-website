"use client";

import { useContext } from "react";

import { Mixes } from "@/api";
import { NowPlayingContext } from "@/components/now-playing-provider";

export function Mix({ mix }: { mix: Mixes[number] }) {
  const { setActivePlayer, setMixcloudIframeUrl } =
    useContext(NowPlayingContext);

  const mixcloudIframeUrl = `https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(
    mix.attributes.url
  )}&hide_cover=1&mini=1&light=1&autoplay=1`;
  return (
    <a
      href="#"
      onClick={async (event) => {
        event.preventDefault();
        setActivePlayer("mixcloud");
        setMixcloudIframeUrl(mixcloudIframeUrl);
        // @ts-expect-error TODO: Add Mixcloud as global var
        const widget = window.Mixcloud.PlayerWidget(
          document.getElementById("mixcloud-iframe")
        );
        await widget.ready;
        await widget.load(mix.attributes.url);
      }}
    >
      <div className="flex flex-row my-2 p-2 border">
        <div className="w-16 flex justify-center">
          {mix.attributes.pictures ? (
            <img
              src={mix.attributes.pictures["320wx320h"]}
              className="object-contain"
            />
          ) : null}
        </div>
        <div className="flex-1 p-2">{mix.attributes.name}</div>
      </div>
    </a>
  );
}
