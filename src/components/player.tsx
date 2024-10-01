"use client";

import { useEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { fetchShows, Show } from "@/api";

export function Player() {
  const [playing, setPlaying] = useState(false);
  const [currentShowLoading, setCurrentShowLoading] = useState(true);
  const [currentShow, setCurrentShow] = useState<Show | null>();
  const player = useRef<HTMLAudioElement>(null);

  const fetchAndSetCurrentShowTitle = async () => {
    const shows = await fetchShows();
    setCurrentShow(shows.current);
    setCurrentShowLoading(false);
  };

  useEffect(() => {
    fetchAndSetCurrentShowTitle();
    setInterval(async () => {
      fetchAndSetCurrentShowTitle();
    }, 60 * 1000);
  }, []);

  if (currentShowLoading) {
    return <>Loading</>;
  }

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
