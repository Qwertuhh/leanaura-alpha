import type { NextConfig } from "next";
import webpack from "webpack";
import { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  webpack: (config: Configuration, { isServer }) => {
    // Add banner plugin in client-side only
    if (!isServer) {
      config.plugins?.push(
        new webpack.BannerPlugin({
          banner: `/*!
 * My Project v1.0.0
 * (c) 2025 Arihant Jain
 * Released under the Apache License
 */`,
          raw: true,
        })
      );
    }
    return config;
  },
  // Add other Next.js config options here
};

export default nextConfig;
