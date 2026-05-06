import type { CmsProvider } from "./types";
import mock from "./providers/mock";
import sanity from "./providers/sanity";

const providers: Record<string, CmsProvider> = {
  mock,
  sanity,
};
let warnedUnknownProvider = false;
let warnedMockWithSanityEnv = false;

export function getCms(): CmsProvider {
  const rawKey = process.env.CMS_PROVIDER ?? "mock";
  const key = rawKey.trim().toLowerCase();

  if (
    key === "mock" &&
    process.env.SANITY_PROJECT_ID?.trim() &&
    !warnedMockWithSanityEnv
  ) {
    warnedMockWithSanityEnv = true;
    console.warn(
      "[cms] Using CMS_PROVIDER=mock while SANITY_PROJECT_ID is set — the Next.js site reads content/mock/*.json, not Studio. Set CMS_PROVIDER=sanity in .env.local to use Sanity."
    );
  }

  const provider = providers[key];
  if (!provider) {
    if (!warnedUnknownProvider) {
      console.warn(
        `[cms] Unknown CMS_PROVIDER "${rawKey}", falling back to "mock".`
      );
      warnedUnknownProvider = true;
    }
    return mock;
  }
  return provider;
}