"use client";

import { DateTime } from "luxon";
import Link from "next/link";
import { useContext } from "react";

import { Show } from "@/api";

import { NowPlayingContext } from "./now-playing-provider";

const placeholderImageUrl =
  "https://res.cloudinary.com/dhikr416c/image/upload/w_800,h_800/v1738153099/placeholder_rmxkui.jpg";

export function NowPlaying({ initCurrentShow }: { initCurrentShow?: Show }) {
  const { currentShow = initCurrentShow } = useContext(NowPlayingContext);

  if (!currentShow) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 md:pt-8">
        <img
          className="w-full"
          src={currentShow.imageUrl ?? placeholderImageUrl}
        />
      </div>
      <div className="flex-1 pt-4 md:pt-8 md:pl-8">
        {currentShow.slug ? (
          <h1 className="text-3xl md:text-2xl font-bold underline">
            <Link href={`/resident/${currentShow.slug}`}>
              {currentShow.name}
            </Link>
          </h1>
        ) : (
          <h1 className="text-3xl md:text-2xl font-bold">
            LIVE NOW: {currentShow.name}
          </h1>
        )}
        {currentShow.starts && currentShow.ends ? (
          <div className="font-bold">
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
