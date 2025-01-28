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
    <div className="flex flex-col md:flex-row">
      <div>
        {currentShow.imageUrl ? (
          <img width={400} src={currentShow.imageUrl} />
        ) : null}
      </div>
      <div className="p-4 md:pt-0">
        {currentShow.slug ? (
          <h1 className="text-3xl md:text-5xl font-bold uppercase underline">
            <Link href={`/resident/${currentShow.slug}`}>
              {currentShow.name}
            </Link>
          </h1>
        ) : (
          <h1 className="text-3xl md:text-5xl font-bold uppercase">
            {currentShow.name}
          </h1>
        )}
        {currentShow.starts && currentShow.ends ? (
          <div className="text-lg font-bold">
            {DateTime.fromISO(currentShow.starts).toLocaleString(
              DateTime.TIME_24_SIMPLE
            )}{" "}
            -{" "}
            {DateTime.fromISO(currentShow.ends).toLocaleString(
              DateTime.TIME_24_SIMPLE
            )}
          </div>
        ) : null}

        {currentShow.tagline ? <div>{currentShow.tagline}</div> : null}
      </div>
    </div>
  );
}
