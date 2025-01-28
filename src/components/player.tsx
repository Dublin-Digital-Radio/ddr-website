"use client";

import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useContext, useEffect, useRef } from "react";

import { NowPlayingContext } from "./now-playing-provider";

export function Player() {
  const { currentShow, activePlayer, setActivePlayer } =
    useContext(NowPlayingContext);
  const player = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (activePlayer === "stream-1") {
      player.current?.play();
    } else {
      player.current?.pause();
    }
  }, [activePlayer]);

  return (
    <div className="border-t-2 border-b-2 border-white md:px-8">
      {currentShow ? (
        <div className="flex items-center py-4">
          <button
            onClick={() => {
              if (player.current) {
                if (activePlayer === "stream-1") {
                  setActivePlayer(undefined);
                } else {
                  setActivePlayer("stream-1");
                }
              }
            }}
          >
            {activePlayer === "stream-1" ? (
              <PauseIcon className="size-8" />
            ) : (
              <PlayIcon className="size-8" />
            )}
          </button>
          <span>ON AIR: {currentShow.name}</span>
          <audio
            ref={player}
            src="https://dublindigitalradio.out.airtime.pro/dublindigitalradio_a"
          />
        </div>
      ) : (
        <noscript>Enable JavaScript to enable the player.</noscript>
      )}
    </div>
  );
}
