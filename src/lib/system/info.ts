import packageJson from "../../../package.json";

export interface PublicSystemInfo {
  version: string;
  gitSha: string | null;
  environment: "development" | "test" | "production";
}

export function normalizeGitSha(value: string | undefined): string | null {
  const sha = value?.trim();
  if (!sha || !/^[a-f0-9]{7,64}$/i.test(sha)) return null;
  return sha.slice(0, 7).toLowerCase();
}

export function getPublicSystemInfo(): PublicSystemInfo {
  const nodeEnv = process.env.NODE_ENV;
  const environment = nodeEnv === "production" || nodeEnv === "test" ? nodeEnv : "development";

  return {
    version: packageJson.version,
    gitSha: normalizeGitSha(
      process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_SHA ?? process.env.GITHUB_SHA,
    ),
    environment,
  };
}
