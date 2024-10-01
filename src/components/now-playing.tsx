"use client";

import { DateTime } from "luxon";
import Link from "next/link";
import { useContext } from "react";

import { NowPlayingContext } from "./now-playing-provider";

export function NowPlaying() {
  const { currentShow } = useContext(NowPlayingContext);

  if (!currentShow) {
    return null;
  }

  return (
    <>
      <div>
        {currentShow.slug ? (
          <Link href={`/resident/${currentShow.slug}`}>{currentShow.name}</Link>
        ) : (
          <>{currentShow.name}</>
        )}
      </div>
      <div>
        {DateTime.fromISO(currentShow.starts).toLocaleString(
          DateTime.TIME_24_SIMPLE
        )}{" "}
        -{" "}
        {DateTime.fromISO(currentShow.ends).toLocaleString(
          DateTime.TIME_24_SIMPLE
        )}
      </div>
    </>
  );
}
