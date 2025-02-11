/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ];
  },
};

export default nextConfig;
