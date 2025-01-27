import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
      <body className="font-chivo">
        <Nav />
        <NowPlayingProvider>
          <Player />
          {children}
          <MixcloudPlayer />
        </NowPlayingProvider>
      </body>
      <Script src="//widget.mixcloud.com/media/js/widgetApi.js" />
    </html>
  );
}
