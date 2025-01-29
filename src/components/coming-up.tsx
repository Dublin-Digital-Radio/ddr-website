import { DateTime } from "luxon";

import { fetchRadioCultNext24HrsSchedule } from "@/api";

export async function ComingUp() {
  const next24HrsSchedule = await fetchRadioCultNext24HrsSchedule();

  return (
    <div className="md:pt-8">
      <h1 className="text-3xl md:text-2xl font-bold uppercase">Schedule</h1>
      {next24HrsSchedule.map((show) => (
        <div key={`${show.name}${show.start}`} className="flex">
          <div className="pr-2 md:py-2">
            {DateTime.fromISO(show.start).toLocaleString(
              DateTime.TIME_24_SIMPLE
            )}{" "}
            -{" "}
            {DateTime.fromISO(show.end).toLocaleString(DateTime.TIME_24_SIMPLE)}{" "}
          </div>
          <div className="flex-1 md:py-2">{show.name}</div>
        </div>
      ))}
    </div>
  );
}
