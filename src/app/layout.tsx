import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import type { Metadata } from "next";
import Script from "next/script";

import { Nav } from "@/components/nav/nav";
import { NowPlayingProvider } from "@/components/now-playing-provider";
import { Player } from "@/components/player";

import { MixcloudPlayer } from "./mixcloud-player";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Dublin Digital Radio",
  description:
    "Dublin Digital Radio is an online digital radio station dedicated to providing a quality platform for the various communities striving to create a socially and culturally progressive city.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className="font-chivo bg-black text-white">
        <Nav />
        <NowPlayingProvider>
          <Player />
          {children}
          <div className="text-xs text-center mt-[60px] md:text-left md:px-8">
            Dublin Digital Radio (ddr.) Company registration number: 681238
          </div>
          <div className="h-[80px]" />
          <MixcloudPlayer />
        </NowPlayingProvider>
      </body>
      <Script src="//widget.mixcloud.com/media/js/widgetApi.js" />
    </html>
  );
}
