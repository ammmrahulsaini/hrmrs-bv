import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/hrms",
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
