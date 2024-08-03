"use client";

import { useEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { fetchShows } from "@/api";

export function Player({
  initialCurrentShowTitle,
}: {
  initialCurrentShowTitle: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [currentShowTitle, setCurrentShowTitle] = useState(
    initialCurrentShowTitle
  );
  const player = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setInterval(async () => {
      const shows = await fetchShows();
      setCurrentShowTitle(shows.current.name);
    }, 60 * 1000);
  }, []);

  return (
    <div>
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
      Live now: {currentShowTitle}
      <audio
        ref={player}
        src="https://dublindigitalradio.out.airtime.pro/dublindigitalradio_a"
      />
    </div>
  );
}
