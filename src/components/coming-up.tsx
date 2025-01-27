import { DateTime } from "luxon";

import { fetchRadioCultNext24HrsSchedule } from "@/api";

export async function ComingUp() {
  const next24HrsSchedule = await fetchRadioCultNext24HrsSchedule();

  return (
    <div>
      <h1 className="text-3xl md:text-5xl font-bold uppercase">Coming up</h1>
      <ul>
        {next24HrsSchedule.map((show) => (
          <li key={`${show.name}${show.start}`}>
            {DateTime.fromISO(show.start).toLocaleString(
              DateTime.TIME_24_SIMPLE
            )}{" "}
            -{" "}
            {DateTime.fromISO(show.end).toLocaleString(DateTime.TIME_24_SIMPLE)}{" "}
            {show.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
