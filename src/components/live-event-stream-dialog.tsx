"use client";

import { useContext } from "react";

import { NowPlayingContext } from "./now-playing-provider";

export function LiveEventStreamDialog() {
  const { liveEventStream, liveEventStreamDialogRef } =
    useContext(NowPlayingContext);

  if (!liveEventStream) {
    return null;
  }

  return (
    <dialog id="dialog" ref={liveEventStreamDialogRef}>
      <form method="dialog">
        <div className="p-4">
          <h1 className="font-bold text-center">{liveEventStream.title}</h1>
          <div>{liveEventStream.description}</div>
          <button
            type="button"
            className="block mt-4 m-auto py-2.5 px-5 text-md rounded-sm border"
            onClick={() => {
              liveEventStreamDialogRef?.current?.close();
            }}
          >
            Close
          </button>
        </div>
      </form>
    </dialog>
  );
}
