import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/news-events/:slug",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/alternating-current-2025/:path*",
        destination:
          "https://ac-2025-website.fly.dev/alternating-current-2025/:path*",
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
