import { DateTime } from "luxon";

import { fetchWeeklySchedule } from "@/api";

export const dynamic = "force-dynamic";

export default async function Schedule() {
  const schedule = await fetchWeeklySchedule();
  return (
    <main>
      {schedule.map((day) => (
        <div key={day.dayName}>
          {day.dayName}
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
