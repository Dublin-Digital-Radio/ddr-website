export function debug(message: string) {
  process.env.DEBUG && console.debug(message);
}

const cloudinaryPrefix = "https://res.cloudinary.com/dhikr416c/image/upload/";

export function getCloudinaryOptimizedImageUrl(
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
