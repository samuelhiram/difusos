import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@academic-risk/fuzzy-core", "@academic-risk/presentation"],
};

export default nextConfig;
