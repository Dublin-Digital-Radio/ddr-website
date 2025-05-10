import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

export function ExternalLink({
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
