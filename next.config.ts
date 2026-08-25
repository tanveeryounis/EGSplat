import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? "/EGSplat";

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: isGitHubPages ? "./tsconfig.pages.json" : "./tsconfig.json",
  },
  ...(isGitHubPages
    ? {
        output: "export",
        basePath: githubPagesBasePath,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
