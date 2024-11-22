// import { Carousel } from "@/components/carousel";
import { ComingUp } from "@/components/coming-up";
import { NewsEvents } from "@/components/news-events";
import { NowPlaying } from "@/components/now-playing";

export default async function Home() {
  return (
    <main className="flex flex-col">
      <div className="flex">
        <div className="flex-1">
          <NowPlaying />
        </div>
        {/* <Carousel /> */}
        <div className="flex-1">
          <ComingUp />
        </div>
      </div>
      <div>
        <NewsEvents />
      </div>
    </main>
  );
}
