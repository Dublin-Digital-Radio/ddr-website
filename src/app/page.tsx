import { Carousel } from "@/components/carousel";
import { NowPlaying } from "@/components/now-playing";

export default async function Home() {
  return (
    <main>
      <NowPlaying />
      <Carousel />
    </main>
  );
}
