import { DateTime } from "luxon";
import Link from "next/link";

import { fetchShows } from "@/api";
import { Carousel } from "@/components/carousel";

export default async function Home() {
  const shows = await fetchShows();
  return (
    <main>
      {shows.current ? (
        <>
          <div>
            {shows.current.slug ? (
              <Link href={`/resident/${shows.current.slug}`}>
                {shows.current.name}
              </Link>
            ) : (
              <>{shows.current.name}</>
            )}
          </div>
          <div>
            {shows.current.starts.toLocaleString(DateTime.TIME_24_SIMPLE)} -{" "}
            {shows.current.ends.toLocaleString(DateTime.TIME_24_SIMPLE)}
          </div>
        </>
      ) : null}
      <Carousel />
    </main>
  );
}
