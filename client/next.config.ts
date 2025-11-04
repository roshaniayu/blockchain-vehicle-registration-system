import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * output: 'export': Deploy as it only requires serving static files.
   * output: 'standalone': Requires a Node.js environment to run the built application.
   */
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
