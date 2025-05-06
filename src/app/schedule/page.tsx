import { DateTime } from "luxon";

import { fetchRadioCultWeeklySchedule } from "@/api";
import { PageContainer } from "@/components/page-container";

export const dynamic = "force-dynamic";

export default async function Schedule() {
  const schedule = await fetchRadioCultWeeklySchedule();
  return (
    <PageContainer>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {schedule.map((day) => (
          <div key={day.dayName} className="pb-4">
            <h1 className="text-xl font-bold uppercase">{day.dayName}</h1>

            <ul>
              {day.shows.map((show) => {
                if (!show.starts || !show.ends) {
                  return null;
                }
                return (
                  <li key={`${show.name}${show.starts}`} className="md:py-2">
                    {DateTime.fromISO(show.starts)
                      .setZone("Europe/Dublin")
                      .toLocaleString(DateTime.TIME_24_SIMPLE)}{" "}
                    -{" "}
                    {DateTime.fromISO(show.ends)
                      .setZone("Europe/Dublin")
                      .toLocaleString(DateTime.TIME_24_SIMPLE)}{" "}
                    {show.name}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
