import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  trailingSlash: false,
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "atlasbiolabs.co",
          },
        ],
        destination: "https://www.atlasbiolabs.co/:path*",
        permanent: true,
      },
    ];
  },
};

export default withContentlayer(nextConfig);
