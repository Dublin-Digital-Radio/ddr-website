import Link from "next/link";

export default function About() {
  return (
    <main className="pt-4 md:px-8">
      <div className="max-w-prose">
        <h1 className="text-3xl font-bold">About ddr.</h1>
        <p className="pb-4">
          Dublin Digital Radio (ddr) is an award-winning, online community radio
          station representing a wealth of alternative music, art and politics
          across Ireland, since 2016. ddr is wholly funded by its members (via{" "}
          <a
            className="underline"
            href="https://www.patreon.com/dublindigitalradio"
          >
            Patreon
          </a>{" "}
          subscriptions), composed of listeners and broadcasters alike, ensuring
          that it remains independent of corporate influence and is run
          democratically by its growing community.
        </p>
        <p className="pb-4">
          ddr aims to provide a radical alternative to established media, a
          station supported by and for its community. ddr&apos;s programming
          reflects this aim, having run radio events in support of{" "}
          <Link
            href="https://www.mixcloud.com/DublinDigitalRadio/playlists/2018-24-hours-womens-voices/"
            className="underline"
          >
            International Women&apos;s Day
          </Link>{" "}
          & Pride (
          <Link
            href="https://www.mixcloud.com/DublinDigitalRadio/playlists/queering-the-airwaves-2020/"
            className="underline"
          >
            Queering the Airwaves
          </Link>
          ); while hosting participatory youth programs in:{" "}
          <Link href="/resident/the-dabbledoomusic-show" className="underline">
            Dabbledoo
          </Link>
          ,{" "}
          <Link href="/resident/young-ddr" className="underline">
            Young ddr
          </Link>{" "}
          &{" "}
          <Link href="/resident/atomic" className="underline">
            Atomic
          </Link>
          .
        </p>
        <p className="pb-4">
          ddr is an avid supporter of experimental and left-of-field music &
          creatives, supporting local scenes directly through our events and
          programming.
        </p>
        <p className="pb-4">
          ddr wishes to empower its members to use radio as a tool for
          collective collaboration & cooperation, horizontal skill share and
          support. The station holds Open Studio events as an introduction to
          radio making, contributing to this collaborative culture.
        </p>
        <p>
          ddr is based in Dublin city centre but is open to all; however, the
          station nurtures connections with collectives across the island and
          internationally to further its aims and values. Read the ddr Guiding
          Principles below.
        </p>
        <h1 className="text-3xl font-bold mt-4">ddr. Guiding Principles</h1>
        <ol className="list-decimal pl-8">
          <li>
            ddr. seeks to provide a platform and advocate for music, artists and
            conversations that are not given voice in the established media.
          </li>
          <li>
            ddr. champions Irish-based artists, DJs and music makers. We want to
            expose you to the quality of those working on this island and the
            sound of Ireland’s underground.
          </li>
          <li>
            ddr. is an alternative radio space for music lovers. We favour the
            live and interactive.
          </li>
          <li>
            ddr. believes in an open and free internet & rejects the logic of
            surveillance capitalism.
          </li>
          <li>
            ddr. is member owned and controlled, not run for profit. We are
            independent and work outside of commercial, institutional and
            political influences; this allows us to be uncompromising in the
            ideas and music we put on air.
          </li>
          <li>
            ddr. seeks to operate transparently, encouraging the community to
            understand the practices and structures of the station, and
            discouraging hierarchical power structures.
          </li>
          <li>
            ddr. is based in Dublin but not limited by geography. We want to
            participate in and foster connections with organisations and
            platforms both in Ireland and internationally.
          </li>
          <li>
            ddr. wants to build an open, inclusive and diverse community where
            differing points of view and opinions are respected. We do not
            tolerate sexism, homophobia, transphobia, racism, classism or other
            forms of discrimination.
          </li>
        </ol>
        <h1 className="text-3xl font-bold mt-4">Get in touch</h1>
        <ul className="list-disc pl-8">
          <li>
            General Enquiries:{" "}
            <a
              href="mailto:contact@dublindigitalradio.com"
              className="underline"
            >
              contact@dublindigitalradio.com
            </a>
          </li>
          <li>
            Pitch a radio show:{" "}
            <Link
              href="https://forms.gle/2D8JMzpw9NoYwcXu8"
              className="underline"
            >
              ddr. Show Application Form
            </Link>
          </li>
          <li>
            Events:{" "}
            <a
              href="mailto:events@dublindigitalradio.com"
              className="underline"
            >
              events@dublindigitalradio.com
            </a>
          </li>
          <li>
            Volunteering:{" "}
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSeDszPSQLzndj7Bd0gWNIagRFyVj7Rt2zzwlYpcosHkCC3Siw/viewform"
              className="underline"
            >
              ddr. Volunteer Form
            </Link>
          </li>
        </ul>
        <h1 className="text-3xl font-bold mt-4">Location</h1>
        <p>
          FLUX
          <br />4 Chatham Row
          <br />
          D02PA06
        </p>
        <div className="p-2">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2382.1306022534245!2d-6.265237923027795!3d53.34091827512926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670f0012aa1ab1%3A0xe84c51ae93be21a6!2sFlux%20Studios%20D2!5e0!3m2!1sen!2sie!4v1738197974304!5m2!1sen!2sie"
            className="border-0 w-full h-[300px]"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <h1 className="text-3xl font-bold mt-4">Partnerships</h1>
        <div className="p-4 bg-white w-[150px]">
          <img src="https://res.cloudinary.com/dhikr416c/image/upload/v1706637563/reset_network_93551520d6.svg" />
        </div>
        <p>
          ddr. is part of{" "}
          <Link href="https://reset-network.eu/" className="underline">
            Reset!
          </Link>{" "}
          - a European network of independent cultural and media organisations.
        </p>
      </div>
    </main>
  );
}
