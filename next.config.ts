import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Rewrite barrel imports (icon libraries especially) into deep per-icon
  // imports so a route only compiles the icons it actually uses instead of the
  // whole package. Icon barrels are the single biggest contributor to dev
  // cold-compile cost on icon-heavy builder pages; this also trims the
  // production module graph.
  experimental: {
    optimizePackageImports: ["lucide-react", "@iconify/react"],
  },
};

export default nextConfig;
