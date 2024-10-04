"use client";

import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useContext, useEffect, useRef } from "react";

import { NowPlayingContext } from "./now-playing-provider";

export function Player() {
  const { currentShow, playing, setPlaying } = useContext(NowPlayingContext);
  const player = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (playing) {
      player.current?.play();
    } else {
      player.current?.pause();
    }
  }, [playing]);

  return (
    <div>
      {currentShow ? (
        <>
          <button
            onClick={() => {
              if (player.current) {
                if (playing) {
                  setPlaying(false);
                } else {
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
