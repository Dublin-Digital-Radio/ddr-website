import { fetchShows } from "@/api";
import { Carousel } from "@/components/carousel";
import { DateTime } from "luxon";

export default async function Home() {
  const shows = await fetchShows();
  return (
    <main>
      <div>{shows.current.name}</div>
      <div>
        {shows.current.starts.toLocaleString(DateTime.TIME_24_SIMPLE)} -{" "}
        {shows.current.ends.toLocaleString(DateTime.TIME_24_SIMPLE)}
      </div>
      <Carousel />
    </main>
  );
}
