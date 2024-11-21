import { decode } from "html-entities";
import { DateTime } from "luxon";
import { z } from "zod";

function convertAirtimeToCmsShowName(airtimeShowName: string) {
  const trimmedAirtimeShowName = airtimeShowName
    ? decodeURIComponent(airtimeShowName)
        .split("|")
        .map((showNameFragment) => showNameFragment.trim())[0]
    : "";

  return decode((trimmedAirtimeShowName ?? "").replace(/\s*\(R\)/, ""));
}

function buildStrapiListSchema<Schema extends z.ZodType>(
  attributesSchema: Schema
) {
  return z.object({
    data: z.array(
      z.object({
        attributes: attributesSchema,
      })
    ),
  });
}

const cmsShowSchema = buildStrapiListSchema(
  z.object({
    name: z.string(),
    slug: z.string(),
    image: z.object({
      data: z
        .object({
          attributes: z.object({
            url: z.string(),
          }),
        })
        .nullable(),
    }),
    tagline: z.string().nullable(),
  })
);

interface FetchShowInfoByNameParams {
  showName: string;
  slug?: never;
}

interface FetchShowInfoBySlugParams {
  showName?: never;
  slug: string;
}

type FetchShowInfoParams =
  | FetchShowInfoByNameParams
  | FetchShowInfoBySlugParams;

export async function fetchShowInfo({ showName, slug }: FetchShowInfoParams) {
  const searchParams = showName
    ? new URLSearchParams({
        "filters[name][$eqi]": showName,
        populate: "*",
      })
    : slug
    ? new URLSearchParams({
        "filters[slug][$eqi]": slug,
        populate: "*",
      })
    : undefined;

  if (!searchParams) {
    return undefined;
  }

  return await fetch(`https://ddr-cms.fly.dev/api/shows?${searchParams}`)
    .then((response) => response.json())
    .then((showInfoResponse) => cmsShowSchema.parse(showInfoResponse))
    .then((showInfoResponse) => showInfoResponse.data)
    .then((showInfoEntries) => {
      if (showInfoEntries[0]) {
        let showInfo = {
          ...showInfoEntries[0].attributes,
          tagline: showInfoEntries[0].attributes.tagline ?? undefined,
        };
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
    starts: airtimeShow.starts.replace(" ", "T"),
    ends: airtimeShow.ends.replace(" ", "T"),
  };
}

type AirtimeShow = ReturnType<typeof formatShow>;

export interface Show {
  name: string;
  starts: AirtimeShow["starts"];
  ends: AirtimeShow["ends"];
  slug?: string;
  imageUrl?: string;
  tagline?: string;
}

export async function fetchShows() {
  const response = await fetch(
    "https://dublindigitalradio.airtime.pro/api/live-info-v2",
    { cache: "force-cache" }
  )
    .then((response) => {
      if (response.ok) {
        console.log("Airtime api ok!");
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  const airtimeShows = z
    .object({
      shows: z.object({
        current: airtimeShowSchema.nullable(),
        next: z.array(airtimeShowSchema.nullable()).nullable(),
      }),
    })
    .parse(response).shows;

  let currentShow: Show | undefined = undefined;
  let nextShow: Show | undefined = undefined;

  if (airtimeShows.current) {
    const currentShowResident = await fetchShowInfo({
      showName: convertAirtimeToCmsShowName(airtimeShows.current.name),
    });

    currentShow = {
      ...formatShow(airtimeShows.current),
      ...currentShowResident,
      imageUrl: currentShowResident?.image.data?.attributes.url,
      tagline: currentShowResident?.tagline,
    };
  }

  if (airtimeShows.next?.[0]) {
    const nextShowResident = await fetchShowInfo({
      showName: convertAirtimeToCmsShowName(airtimeShows.next[0].name),
    });

    nextShow = {
      ...formatShow(airtimeShows.next[0]),
      ...nextShowResident,
    };
  }

  return {
    current: currentShow,
    next: nextShow,
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
  const response = await fetch(
    "https://dublindigitalradio.airtime.pro/api/week-info"
  ).then((response) => response.json());
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

export async function fetchNext24HrsSchedule() {
  const response = await fetch(
    "https://dublindigitalradio.airtime.pro/api/week-info"
  ).then((response) => response.json());

  const now = DateTime.now();
  const nowPlus24Hrs = now.plus({ hours: 24 });
  const nowDayName = dayNameSchema.parse(now.weekdayLong.toLowerCase());
  const nextDayName =
    nowDayName === "sunday"
      ? "nextmonday"
      : dayNameSchema.parse(nowPlus24Hrs.weekdayLong.toLowerCase());

  const retrievedSchedule = z
    .object({
      [nowDayName]: z.array(airtimeShowSchema),
      [nextDayName]: z.array(airtimeShowSchema),
    })
    .parse(response);

  return [
    ...(retrievedSchedule[nowDayName] ?? []).map(formatShow),
    ...(retrievedSchedule[nextDayName] ?? []).map(formatShow),
  ].filter((show) => {
    return (
      now < DateTime.fromISO(show.starts) &&
      nowPlus24Hrs > DateTime.fromISO(show.starts)
    );
  });
}

const mixesSchema = buildStrapiListSchema(
  z.object({
    name: z.string(),
    url: z.string(),
  })
);

export type Mixes = z.infer<typeof mixesSchema>["data"];

export async function fetchMixes(params: { searchQuery?: string }) {
  const url = params.searchQuery
    ? `https://ddr-cms.fly.dev/api/mixes/search?${new URLSearchParams({
        filters: params.searchQuery,
      })}`
    : `https://ddr-cms.fly.dev/api/mixes?${new URLSearchParams({
        "pagination[page]": "1",
        "pagination[pageSize]": "6",
        sort: "createdTime:desc",
        "filters[slug][$null]": "false",
      })}`;
  return await fetch(url)
    .then((response) => response.json())
    .then((json) => mixesSchema.parse(json))
    .then((mixesList) => mixesList.data);
}

const residentsSchema = buildStrapiListSchema(
  z.object({
    name: z.string(),
    slug: z.string(),
  })
);

export async function fetchResidents() {
  return await fetch(
    "https://ddr-cms.fly.dev/api/shows?pagination[page]=1&pagination[pageSize]=20&filters[active][$eq]=true&sort=name&populate=*"
  )
    .then((response) => response.json())
    .then((json) => residentsSchema.parse(json))
    .then(({ data }) => {
      return data;
    });
}
