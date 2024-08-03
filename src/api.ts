import { z } from "zod";
import airtime from "@dublin-digital-radio/airtime-pro-api";

const ddrAirtime = airtime.init({ stationName: "dublindigitalradio" });

const showSchema = z.object({
  name: z.string(),
});

export type Show = z.infer<typeof showSchema>;

export async function fetchShows() {
  const response = await ddrAirtime.liveInfoV2();
  return z
    .object({
      shows: z.object({
        current: showSchema,
      }),
    })
    .parse(response).shows;
}
