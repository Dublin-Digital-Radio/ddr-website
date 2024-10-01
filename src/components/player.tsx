"use client";

import { useContext, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { NowPlayingContext } from "./now-playing-provider";

export function Player() {
  const { currentShow } = useContext(NowPlayingContext);
  const [playing, setPlaying] = useState(false);
  const player = useRef<HTMLAudioElement>(null);

  return (
    <div>
      {currentShow ? (
        <>
          <button
            onClick={() => {
              if (player.current) {
                if (playing) {
                  player.current.pause();
                  setPlaying(false);
                } else {
                  player.current.play();
                  setPlaying(true);
                }
              }
            }}
          >
            {playing ? (
              <PauseIcon className="size-8" />
            ) : (
              <PlayIcon className="size-8" />
            )}
          </button>
          Live now: {currentShow.name}
          <audio
            ref={player}
            src="https://dublindigitalradio.out.airtime.pro/dublindigitalradio_a"
          />
        </>
      ) : (
        <>Station offline</>
      )}
    </div>
  );
}
