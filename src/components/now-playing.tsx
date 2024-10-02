"use client";

import { DateTime } from "luxon";
import Link from "next/link";
import { useContext } from "react";

import { NowPlayingContext } from "./now-playing-provider";

export function NowPlaying() {
  const { currentShow, nextShow } = useContext(NowPlayingContext);

  if (!currentShow || !nextShow) {
    return null;
  }

  return (
    <>
      <h1>Live now</h1>
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
      <h1>Next</h1>
      <div>
        {nextShow.slug ? (
          <Link href={`/resident/${nextShow.slug}`}>{nextShow.name}</Link>
        ) : (
          <>{nextShow.name}</>
        )}
      </div>
      <div>
        {DateTime.fromISO(nextShow.starts).toLocaleString(
          DateTime.TIME_24_SIMPLE
        )}{" "}
        -{" "}
        {DateTime.fromISO(nextShow.ends).toLocaleString(
          DateTime.TIME_24_SIMPLE
        )}
      </div>
    </>
  );
}
