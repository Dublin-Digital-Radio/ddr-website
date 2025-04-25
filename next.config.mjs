import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
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
        destination: "/alternating-current-2025/:path*/index.html",
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
