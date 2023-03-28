/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: false,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      ],
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

module.exports = nextConfig;
