import airtime from "@dublin-digital-radio/airtime-pro-api";
import { decode } from "html-entities";
import { DateTime } from "luxon";
import { z } from "zod";

const ddrAirtime = airtime.init({ stationName: "dublindigitalradio" });

function convertAirtimeToCmsShowName(airtimeShowName: string) {
  const trimmedAirtimeShowName = airtimeShowName
    ? decodeURIComponent(airtimeShowName)
        .split("|")
        .map((showNameFragment) => showNameFragment.trim())[0]
    : "";

  return decode((trimmedAirtimeShowName ?? "").replace(/\s*\(R\)/, ""));
}

const cmsShowSchema = z.object({
  data: z.array(
    z.object({
      attributes: z.object({
        name: z.string(),
        slug: z.string(),
      }),
    })
  ),
});

async function fetchShowInfo(showName: string) {
  return await fetch(
    `https://ddr-cms.fly.dev/api/shows?${new URLSearchParams({
      "filters[name][$eqi]": showName,
      populate: "*",
    })}`
  )
    .then((response) => response.json())
    .then((showInfoResponse) => cmsShowSchema.parse(showInfoResponse))
    .then((showInfoResponse) => showInfoResponse.data)
    .then((showInfoEntries) => {
      if (showInfoEntries[0]) {
        let showInfo = showInfoEntries[0].attributes;
        // if (showInfo.image?.data?.attributes.url) {
        //   showInfo.image.data.attributes.url =
        //     showInfo.image.data.attributes.url.replace(/^http:/, 'https:');
        // }

        return showInfo;
      }
    });
}

const airtimeShowSchema = z.object({
  name: z.string(),
  starts: z.string(),
  ends: z.string(),
});

function formatShow(airtimeShow: z.infer<typeof airtimeShowSchema>) {
  return {
    name: airtimeShow.name,
    starts: DateTime.fromISO(airtimeShow.starts.replace(" ", "T")),
    ends: DateTime.fromISO(airtimeShow.ends.replace(" ", "T")),
  };
}

type AirtimeShow = ReturnType<typeof formatShow>;

export interface Show {
  name: string;
  starts: AirtimeShow["starts"];
  ends: AirtimeShow["ends"];
  slug?: string;
}

export async function fetchShows() {
  const response = await ddrAirtime.liveInfoV2();
  const airtimeShows = z
    .object({
      shows: z.object({
        current: airtimeShowSchema.nullable(),
      }),
    })
    .parse(response).shows;

  if (airtimeShows.current) {
    const currentShowResident = await fetchShowInfo(
      convertAirtimeToCmsShowName(airtimeShows.current.name)
    );

    return {
      current: {
        ...formatShow(airtimeShows.current),
        ...currentShowResident,
      },
    };
  }

  return {
    current: undefined,
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
      monday: z.array(airtimeShowSchema),
      tuesday: z.array(airtimeShowSchema),
      wednesday: z.array(airtimeShowSchema),
      thursday: z.array(airtimeShowSchema),
      friday: z.array(airtimeShowSchema),
      saturday: z.array(airtimeShowSchema),
      sunday: z.array(airtimeShowSchema),
      nextmonday: z.array(airtimeShowSchema),
      nexttuesday: z.array(airtimeShowSchema),
      nextwednesday: z.array(airtimeShowSchema),
      nextthursday: z.array(airtimeShowSchema),
      nextfriday: z.array(airtimeShowSchema),
      nextsaturday: z.array(airtimeShowSchema),
      nextsunday: z.array(airtimeShowSchema),
    })
    .parse(response);

  const today = DateTime.now();
  const todayDayName = dayNameSchema.parse(today.weekdayLong.toLowerCase());
  let schedule: {
    dayName: string;
    shows: AirtimeShow[];
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
