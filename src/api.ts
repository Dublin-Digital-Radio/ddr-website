import { DateTime } from "luxon";
import { z } from "zod";
import airtime from "@dublin-digital-radio/airtime-pro-api";

const ddrAirtime = airtime.init({ stationName: "dublindigitalradio" });

const showSchema = z.object({
  name: z.string(),
  starts: z.string(),
  ends: z.string(),
});

function formatShow(show: z.infer<typeof showSchema>) {
  return {
    name: show.name,
    starts: DateTime.fromISO(show.starts.replace(" ", "T")),
    ends: DateTime.fromISO(show.ends.replace(" ", "T")),
  };
}

export type Show = ReturnType<typeof formatShow>;

export async function fetchShows() {
  const response = await ddrAirtime.liveInfoV2();
  const retrievedShows = z
    .object({
      shows: z.object({
        current: showSchema.nullable(),
      }),
    })
    .parse(response).shows;
  return {
    current: retrievedShows.current
      ? formatShow(retrievedShows.current)
      : retrievedShows.current,
  };
}

const dayName = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const dayNameSchema = z.union([
  z.literal("monday"),
  z.literal("tuesday"),
  z.literal("wednesday"),
  z.literal("thursday"),
  z.literal("friday"),
  z.literal("saturday"),
  z.literal("sunday"),
]);

export async function fetchWeeklySchedule() {
  const response = await ddrAirtime.weekInfo();
  const retrievedSchedule = z
    .object({
      monday: z.array(showSchema),
      tuesday: z.array(showSchema),
      wednesday: z.array(showSchema),
      thursday: z.array(showSchema),
      friday: z.array(showSchema),
      saturday: z.array(showSchema),
      sunday: z.array(showSchema),
      nextmonday: z.array(showSchema),
      nexttuesday: z.array(showSchema),
      nextwednesday: z.array(showSchema),
      nextthursday: z.array(showSchema),
      nextfriday: z.array(showSchema),
      nextsaturday: z.array(showSchema),
      nextsunday: z.array(showSchema),
    })
    .parse(response);

  const today = DateTime.now();
  const todayDayName = dayNameSchema.parse(today.weekdayLong.toLowerCase());
  let schedule: {
    dayName: string;
    shows: Show[];
  }[] = [];
  schedule[0] = {
    dayName: dayName[todayDayName],
    shows: retrievedSchedule[todayDayName].map(formatShow),
  };
  let hasPassedSunday = todayDayName === "sunday";
  let currentDayName: z.infer<typeof dayNameSchema>;
  // Convert the returned schedule format to next 7 days schedule
  for (let i = 1; i < 7; i++) {
    currentDayName = dayNameSchema.parse(
      today.plus({ days: i }).weekdayLong.toLowerCase()
    );
    schedule[i] = {
      dayName: dayName[currentDayName],
      shows: hasPassedSunday
        ? retrievedSchedule[`next${currentDayName}`].map(formatShow)
        : retrievedSchedule[currentDayName].map(formatShow),
    };

    if (currentDayName === "sunday") hasPassedSunday = true;
  }

  return schedule;
}
