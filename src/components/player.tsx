"use client";

import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useContext, useEffect, useRef } from "react";

import { NowPlayingContext } from "./now-playing-provider";

export function Player() {
  const { scheduledStreamUrl, currentShow, activePlayer, setActivePlayer } =
    useContext(NowPlayingContext);
  const player = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (activePlayer === "stream-1") {
      player.current = new Audio(
        `${scheduledStreamUrl}?nocache=${Math.random().toString(36)}`,
      );
      player.current.play();
    } else {
      player.current?.pause();
    }
  }, [activePlayer, scheduledStreamUrl]);

  return (
    <div className="border-t-2 border-b-2 border-white md:px-8">
      <div className="flex items-center py-4">
        {currentShow && scheduledStreamUrl ? (
          <>
            <button
              onClick={() => {
                if (activePlayer === "stream-1") {
                  setActivePlayer(undefined);
                } else {
                  setActivePlayer("stream-1");
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
          </>
        ) : (
          <div>
            {currentShow === null ? <span>Station offline. </span> : null}
            <noscript>Enable JavaScript to enable the player.</noscript>
          </div>
        )}
      </div>
    </div>
  );
}
