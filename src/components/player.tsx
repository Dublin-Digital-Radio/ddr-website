"use client";

import { useRef, useState } from "react";

export function Player() {
  const [playing, setPlaying] = useState(false);
  const player = useRef<HTMLAudioElement>(null);

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
        {playing ? "pause" : "play"}
      </button>
      <audio
        ref={player}
        src="https://dublindigitalradio.out.airtime.pro/dublindigitalradio_a"
      />
    </div>
  );
}
