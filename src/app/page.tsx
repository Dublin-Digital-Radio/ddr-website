// import { Carousel } from "@/components/carousel";
import { ComingUp } from "@/components/coming-up";
import { NewsEvents } from "@/components/news-events";
import { NowPlaying } from "@/components/now-playing";

export default async function Home() {
  return (
    <main className="flex flex-col">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 mb-4">
          <NowPlaying />
        </div>
        {/* <Carousel /> */}
        <div className="flex-1 mb-4">
          <ComingUp />
        </div>
      </div>
      <div>
        <NewsEvents />
      </div>
    </main>
  );
}
