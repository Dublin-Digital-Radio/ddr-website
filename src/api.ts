import { DateTime } from "luxon";
import { z } from "zod";
import airtime from "@dublin-digital-radio/airtime-pro-api";

const ddrAirtime = airtime.init({ stationName: "dublindigitalradio" });

const showSchema = z.object({
  name: z.string(),
  starts: z.string(),
  ends: z.string(),
});

export type Show = z.infer<typeof showSchema>;

function formatShow(show: Show) {
  return {
    name: show.name,
    starts: DateTime.fromISO(show.starts.replace(" ", "T")),
    ends: DateTime.fromISO(show.ends.replace(" ", "T")),
  };
}

export async function fetchShows() {
  const response = await ddrAirtime.liveInfoV2();
  const retrievedShows = z
    .object({
      shows: z.object({
        current: showSchema,
      }),
    })
    .parse(response).shows;
  return {
    current: formatShow(retrievedShows.current),
  };
}
