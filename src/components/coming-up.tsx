import { DateTime } from "luxon";

import { fetchNext24HrsSchedule } from "@/api";

export async function ComingUp() {
  const next24HrsSchedule = await fetchNext24HrsSchedule();
  return (
    <div>
      <h1 className="text-5xl font-bold uppercase">Coming up</h1>
      <ul>
        {next24HrsSchedule.map((show) => (
          <li key={`${show.name}${show.starts}`}>
            {DateTime.fromISO(show.starts).toLocaleString(
              DateTime.TIME_24_SIMPLE
            )}{" "}
            -{" "}
            {DateTime.fromISO(show.ends).toLocaleString(
              DateTime.TIME_24_SIMPLE
            )}{" "}
            {show.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
