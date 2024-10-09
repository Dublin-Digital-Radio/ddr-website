"use client";

import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useContext, useEffect, useRef } from "react";

import { NowPlayingContext } from "./now-playing-provider";

export function Player() {
  const { currentShow, activePlayer, setActivePlayer } = useContext(NowPlayingContext);
  const player = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (activePlayer === 'stream-1') {
      player.current?.play();
    } else {
      player.current?.pause();
    }
  }, [activePlayer]);

  return (
    <div>
      {currentShow ? (
        <>
          <button
            onClick={() => {
              if (player.current) {
                if (activePlayer === 'stream-1') {
                  setActivePlayer(undefined);
                } else {
                  setActivePlayer('stream-1');
                }
              }
            }}
          >
            {activePlayer === 'stream-1' ? (
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
