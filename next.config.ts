import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/OpenAI_Enterprise_Billing_Web",
  assetPrefix: "/OpenAI_Enterprise_Billing_Web/",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
