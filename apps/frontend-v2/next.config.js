/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: true,
});
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: false,
  webpack: (config, options) => {
    (config.experiments = { ...config.experiments, topLevelAwait: true }),
      config.module.rules.push({
        test: /\.m?js$/,
        exclude: /node_modules/,
        // use: [
        //   {
        //     loader: "babel-loader",
        //     options: {
        //       presets: [["@babel/preset-env", { targets: "defaults" }], ["@babel/plugin-syntax-import-assertions"]],
        //     },
        //   },
        // ],
      });

    return config;
  },
  transpilePackages: ["@yc/yc-models", "ethers"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = withPlugins([[withBundleAnalyzer], nextConfig]);
