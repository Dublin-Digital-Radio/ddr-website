import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata, ResolvingMetadata } from "next";

import { fetchShowInfo } from "@/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParent = await parent;
  const resident = await fetchShowInfo({ slug: (await params).slug });

  if (!resident) {
    return {
      title: resolvedParent.title?.absolute,
      description: resolvedParent.description,
    };
  }

  return {
    title: `${resident.name} | ${resolvedParent.title?.absolute}`,
    openGraph: {
      images: resident.image.data?.attributes.url
        ? [resident.image.data.attributes.url]
        : [],
    },
  };
}

function getSocialMediaUrl({
  value,
  hostname,
  detectAtSign = false,
}: {
  value: string;
  hostname: string;
  detectAtSign?: boolean;
}) {
  if (value.startsWith(`https://${hostname}/`)) {
    return value;
  } else if (value.startsWith(`www.${hostname}/`)) {
    return `https://${value}`;
  } else if (value.startsWith(`${hostname}/`)) {
    return `https://${value}`;
  } else if (detectAtSign) {
    if (value.startsWith("@")) {
      return `https://${hostname}/${value.replace("@", "")}`;
    } else {
      return `https://${hostname}/${value}`;
    }
  } else {
    return `https://${hostname}/${value}`;
  }
}

function ExternalLink({
  type,
  value,
}: {
  type: "instagram" | "twitter" | "facebook" | "website";
  value: string | null;
}) {
  if (!value) {
    return null;
  }

  const href =
    type === "instagram"
      ? getSocialMediaUrl({
          value,
          hostname: "instagram.com",
          detectAtSign: true,
        })
      : type === "twitter"
      ? getSocialMediaUrl({
          value,
          hostname: "twitter.com",
          detectAtSign: true,
        })
      : type === "facebook"
      ? getSocialMediaUrl({
          value,
          hostname: "facebook.com",
        })
      : value;

  const icon = {
    instagram: faInstagram,
    twitter: faTwitter,
    facebook: faFacebook,
    website: faGlobe,
  }[type];

  return (
    <p>
      <FontAwesomeIcon icon={icon} className="fa-fw" />{" "}
      <a href={href} className="underline">
        {value}
      </a>
    </p>
  );
}

export default async function Resident({
  params,
}: {
  params: { slug: string };
}) {
  const resident = await fetchShowInfo({ slug: params.slug });
  if (!resident) {
    return null;
  }

  return (
    <main className="flex flex-col md:flex-col lg:flex-row">
      <div>
        <img className="w-full" src={resident.image.data?.attributes.url} />
      </div>
      <div className="p-4">
        <h1 className="text-3xl font-bold">{resident.name}</h1>
        {resident.tagline ? <p className="pb-4">{resident.tagline}</p> : null}
        <ExternalLink type="instagram" value={resident.instagram} />
        <ExternalLink type="twitter" value={resident.twitter} />
        <ExternalLink type="facebook" value={resident.facebook} />
        <ExternalLink type="website" value={resident.website} />
      </div>
    </main>
  );
}
