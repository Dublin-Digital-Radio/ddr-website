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
        id: z.number(),
        attributes: attributesSchema,
      })
    ),
    meta: z.object({
      pagination: z.object({
        // Some search APIs don't return pagination
        page: z.number().optional(),
        pageSize: z.number().optional(),
        pageCount: z.number().optional(),
        total: z.number().optional(),
      }),
    }),
  });
}

const imageSchema = z.object({
  data: z
    .object({
      attributes: z.object({
        url: z.string(),
      }),
    })
    .nullable(),
});

const cmsShowSchema = buildStrapiListSchema(
  z.object({
    name: z.string(),
    slug: z.string(),
    image: imageSchema,
    tagline: z.string().nullable(),
    instagram: z.string().nullable(),
    twitter: z.string().nullable(),
    facebook: z.string().nullable(),
    website: z.string().nullable(),
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
  starts?: string;
  ends?: string;
  slug?: string;
  imageUrl?: string;
  tagline?: string;
}

const radioCultLiveShowSchema = z.object({
  success: z.boolean(),
  result: z.union([
    z.object({
      status: z.literal("schedule"),
      content: z.object({
        title: z.string(),
        startDateUtc: z.string(),
        endDateUtc: z.string(),
      }),
    }),
    z.object({
      status: z.literal("defaultPlaylist"),
      content: z.object({
        name: z.string(),
      }),
      metadata: z.object({
        title: z.string(),
      }),
    }),
    z.object({
      status: z.literal("offAir"),
      content: z.literal("Off Air"),
    }),
  ]),
});

export async function fetchRadioCultLiveShow() {
  try {
    const radioCultLiveShow = await fetch(
      "https://api.radiocult.fm/api/station/dublin-digital-radio/schedule/live",
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_RADIO_CULT_API_KEY ?? "",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        return radioCultLiveShowSchema.parse(response);
      })
      .then((response) => {
        if (response.result.status === "offAir") {
          return undefined;
        } else if (response.result.status === "defaultPlaylist") {
          return {
            title: response.result.content.name,
            starts: undefined,
            ends: undefined,
            tagline: response.result.metadata.title,
          };
        } else {
          return {
            title: response.result.content.title,
            starts: response.result.content.startDateUtc,
            ends: response.result.content.endDateUtc,
          };
        }
      });

    if (radioCultLiveShow) {
      const currentShowResident = await fetchShowInfo({
        showName: convertAirtimeToCmsShowName(radioCultLiveShow.title),
      });

      return {
        name: radioCultLiveShow.title,
        starts: "",
        ends: "",
        ...currentShowResident,
        imageUrl: currentShowResident?.image.data?.attributes.url,
        tagline: currentShowResident?.tagline ?? radioCultLiveShow.tagline,
      };
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
    return undefined;
  }
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
    "https://dublindigitalradio.airtime.pro/api/week-info",
    { cache: "no-store" }
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

const radioCultScheduleSchema = z.object({
  schedules: z.array(
    z.object({
      title: z.string(),
      start: z.string(),
      end: z.string(),
    })
  ),
});

export async function fetchRadioCultNext24HrsSchedule() {
  const now = DateTime.now();
  const nowPlus24Hrs = now.plus({ hours: 24 });
  const startDateTimestamp = now.toUTC();
  const endDateTimestamp = nowPlus24Hrs.toUTC();

  return fetch(
    `https://api.radiocult.fm/api/station/dublin-digital-radio/schedule?startDate=${startDateTimestamp}&endDate=${endDateTimestamp}`,
    {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_RADIO_CULT_API_KEY ?? "",
      },
    }
  )
    .then((response) => response.json())
    .then((response) => radioCultScheduleSchema.parse(response))
    .then((response) => {
      return response.schedules
        .filter((scheduleItem) => {
          return (
            now < DateTime.fromISO(scheduleItem.start) &&
            nowPlus24Hrs > DateTime.fromISO(scheduleItem.end)
          );
        })
        .map((scheduleItem) => ({
          name: scheduleItem.title,
          start: scheduleItem.start,
          end: scheduleItem.end,
        }));
    });
}

const mixesSchema = buildStrapiListSchema(
  z.object({
    name: z.string(),
    url: z.string(),
    pictures: z
      .object({
        "320wx320h": z.string(),
      })
      .optional(),
  })
);

export type Mixes = z.infer<typeof mixesSchema>["data"];

function getSearchQueryParams(searchQuery: string) {
  const terms = searchQuery.split(" ");
  if (terms.length === 0) {
    return {};
  } else if (terms.length === 1 && terms[0]) {
    return { "filters[name][$containsi]": terms[0] };
  } else {
    return terms.reduce((acc, term, index) => {
      return {
        ...acc,
        [`filters[$or][0][${index}][name][$containsi]`]: term,
      };
    }, {} as Record<string, string>);
  }
}

export async function fetchMixes(params: { searchQuery?: string }) {
  // Using Strapi filters because the custom `/mixes/search` API is a bit broken
  // https://github.com/Dublin-Digital-Radio/ddr-cms/issues/5
  const url = `https://ddr-cms.fly.dev/api/mixes?${new URLSearchParams({
    "pagination[page]": "1",
    "pagination[pageSize]": "20",
    sort: "createdTime:desc",
    "filters[slug][$null]": "false",
    ...(params.searchQuery ? getSearchQueryParams(params.searchQuery) : {}),
  })}`;
  return await fetch(url)
    .then((response) => response.json())
    .then((json) => {
      return mixesSchema.parse(json);
    })
    .then((mixesList) => mixesList.data);
}

const residentsSchema = buildStrapiListSchema(
  z.object({
    name: z.string(),
    slug: z.string(),
    image: imageSchema,
  })
);

export type Residents = z.infer<typeof residentsSchema>["data"];

export async function fetchAllResidents() {
  let allResidents: z.infer<typeof residentsSchema>["data"] = [];
  let currentPage = 1;
  let pageCount = 1;

  do {
    await fetch(
      `https://ddr-cms.fly.dev/api/shows?pagination[page]=${currentPage}&pagination[pageSize]=100&filters[active][$eq]=true&sort=name&populate=*`
    )
      .then((response) => response.json())
      .then((json) => residentsSchema.parse(json))
      .then(({ data, meta }) => {
        if (meta.pagination.pageCount) {
          pageCount = meta.pagination.pageCount;
        }
        allResidents = allResidents.concat(data);
      });

    currentPage++;
  } while (currentPage <= pageCount);

  return allResidents;
}

export async function fetchResidents(params: { searchQuery?: string }) {
  let currentPage = 1;

  return await fetch(
    `https://ddr-cms.fly.dev/api/shows?pagination[page]=${currentPage}&pagination[pageSize]=100&filters[active][$eq]=true&filters[name][$containsi]=${params.searchQuery}&sort=name&populate=*`
  )
    .then((response) => response.json())
    .then((json) => residentsSchema.parse(json))
    .then(({ data }) => {
      return data;
    });
}

const blogPostsSchema = buildStrapiListSchema(
  z.object({
    slug: z.string(),
    title: z.string(),
    content: z.string(),
    date: z.string(),
    image: imageSchema,
  })
);

export async function fetchBlogPosts() {
  return await fetch(
    "https://ddr-cms.fly.dev/api/blogs?pagination[pageSize]=4&sort=date:desc&filters[publishedAt][$null]=false&filters[slug][$not][$eq]=&populate=*",
    { cache: "no-store" }
  )
    .then((response) => response.json())
    .then((json) => {
      return blogPostsSchema.parse(json);
    })
    .then(({ data }) => {
      return data;
    });
}

export async function fetchBlogPost({ slug }: { slug: string }) {
  const searchParams = new URLSearchParams({
    "filters[slug][$eq]": slug,
    populate: "*",
  });

  return await fetch(`https://ddr-cms.fly.dev/api/blogs?${searchParams}`)
    .then((response) => response.json())
    .then((response) => blogPostsSchema.parse(response))
    .then((response) => response.data)
    .then((blogPostEntries) => {
      if (blogPostEntries[0]) {
        return blogPostEntries[0];
      }
    });
}
