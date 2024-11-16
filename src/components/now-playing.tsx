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
    <div className="flex flex-row">
      <div>
        {currentShow.imageUrl ? (
          <img width={400} src={currentShow.imageUrl} />
        ) : null}
      </div>
      <div>
        {currentShow.slug ? (
          <h1 className="text-5xl font-bold uppercase">
            <Link href={`/resident/${currentShow.slug}`}>
              {currentShow.name}
            </Link>
          </h1>
        ) : (
          <h1 className="text-5xl font-bold uppercase">{currentShow.name}</h1>
        )}
        <div className="text-lg font-bold">
          {DateTime.fromISO(currentShow.starts).toLocaleString(
            DateTime.TIME_24_SIMPLE
          )}{" "}
          -{" "}
          {DateTime.fromISO(currentShow.ends).toLocaleString(
            DateTime.TIME_24_SIMPLE
          )}
        </div>
        {currentShow.tagline ? <div>{currentShow.tagline}</div> : null}
      </div>
    </div>
  );
}
