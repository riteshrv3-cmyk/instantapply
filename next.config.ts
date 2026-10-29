import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These packages use Node internals or WASM; keep them out of the bundle.
  serverExternalPackages: ["@electric-sql/pglite", "pg", "mammoth", "unpdf"],
};

export default nextConfig;
