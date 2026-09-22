import packageJson from "../../../package.json";

export type PublicEnvironment = "development" | "test" | "preview" | "production";

export interface PublicSystemInfo {
  version: string;
  gitSha: string | null;
  environment: PublicEnvironment;
}

export function normalizeGitSha(value: string | undefined): string | null {
  const sha = value?.trim();
  if (!sha || !/^[a-f0-9]{7,64}$/i.test(sha)) return null;
  return sha.slice(0, 7).toLowerCase();
}

export function resolvePublicEnvironment(
  nodeEnv: string | undefined,
  vercelEnv: string | undefined,
): PublicEnvironment {
  if (vercelEnv === "preview") return "preview";
  if (vercelEnv === "production") return "production";
  if (vercelEnv === "development") return "development";

  if (nodeEnv === "test") return "test";
  if (nodeEnv === "production") return "production";

  return "development";
}

export function getPublicSystemInfo(): PublicSystemInfo {
  return {
    version: packageJson.version,
    gitSha: normalizeGitSha(
      process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_SHA ?? process.env.GITHUB_SHA,
    ),
    environment: resolvePublicEnvironment(process.env.NODE_ENV, process.env.VERCEL_ENV),
  };
}
