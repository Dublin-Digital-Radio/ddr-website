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

const cloudinaryPrefix = "https://res.cloudinary.com/dhikr416c/image/upload/";

function getCloudinaryOptimizedImageUrl(
  url: string,
  options: {
    width: number;
    height: number;
  },
) {
  const httpsUrl = url.startsWith("http://")
    ? `https://${url.replace("http://", "")}`
    : url;
  if (httpsUrl.startsWith(cloudinaryPrefix)) {
    return `${cloudinaryPrefix}f_jpg,c_fill,w_${options.width},h_${options.height}/${httpsUrl.replace(cloudinaryPrefix, "")}`;
  } else {
    return httpsUrl;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
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
        ? [
            getCloudinaryOptimizedImageUrl(resident.image.data.attributes.url, {
              width: 800,
              height: 800,
            }),
          ]
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

export default async function Resident(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const resident = await fetchShowInfo({ slug: params.slug });
  if (!resident) {
    return null;
  }

  return (
    <main className="flex flex-col md:flex-col lg:flex-row md:px-8">
      <div className="lg:w-1/3">
        <img className="w-full" src={resident.image.data?.attributes.url} />
      </div>
      <div className="p-4 lg:w-1/3">
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
