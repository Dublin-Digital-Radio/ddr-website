// import { Carousel } from "@/components/carousel";
import { ComingUp } from "@/components/coming-up";
import { NowPlaying } from "@/components/now-playing";

export default async function Home() {
  return (
    <main className="flex">
      <div className="flex-1">
        <NowPlaying />
      </div>
      {/* <Carousel /> */}
      <div className="flex-1">
        <ComingUp />
      </div>
    </main>
  );
}
