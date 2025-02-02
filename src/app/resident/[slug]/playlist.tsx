"use client";

import { useContext, useEffect, useState } from "react";

import {
  fetchAllMixcloudPlaylists,
  fetchMixcloudPlaylistMixes,
  MixcloudMixes,
} from "@/api";
import { NowPlayingContext } from "@/components/now-playing-provider";

export function Playlist({ showName }: { showName: string }) {
  const { setActivePlayer, setMixcloudIframeUrl } =
    useContext(NowPlayingContext);

  const [mixes, setMixes] = useState<MixcloudMixes>();

  // There must be a better fetch strategy than this
  useEffect(() => {
    fetchAllMixcloudPlaylists()
      .then((playlists) =>
        playlists.find((playlist) => playlist.name === showName),
      )
      .then((playlist) => {
        if (playlist) {
          fetchMixcloudPlaylistMixes(playlist.slug).then((mixes) =>
            setMixes(mixes),
          );
        }
      });
  }, [showName]);

  if (!mixes) {
    return null;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Listen back</h2>
      {mixes.map((mix) => (
        <a
          key={mix.key}
          href="#"
          onClick={async (event) => {
            event.preventDefault();
            setActivePlayer("mixcloud");
            setMixcloudIframeUrl(
              `https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(
                mix.url,
              )}&hide_cover=1&mini=1&light=1&autoplay=1`,
            );
            // @ts-expect-error TODO: Add Mixcloud as global var
            const widget = window.Mixcloud.PlayerWidget(
              document.getElementById("mixcloud-iframe"),
            );
            await widget.ready;
            await widget.load(mix.url);
          }}
        >
          <div className="flex p-2 mb-2 border border-white">
            <div>
              {mix.pictures?.medium ? <img src={mix.pictures.medium} /> : null}
            </div>
            <div className="flex-1 pl-2">{mix.name}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
