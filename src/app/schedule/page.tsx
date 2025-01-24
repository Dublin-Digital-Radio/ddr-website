import { DateTime } from "luxon";

import { fetchWeeklySchedule } from "@/api";

export const dynamic = "force-dynamic";

export default async function Schedule() {
  const schedule = await fetchWeeklySchedule();
  return (
    <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      {schedule.map((day) => (
        <div key={day.dayName} className="pb-4">
          <h1 className="text-xl font-bold uppercase">{day.dayName}</h1>

          <ul>
            {day.shows.map((show) => (
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
      ))}
    </main>
  );
}
