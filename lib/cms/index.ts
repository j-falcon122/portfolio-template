import type { CmsProvider } from "./types";
import mock from "./providers/mock";
import sanity from "./providers/sanity";

const providers: Record<string, CmsProvider> = {
  mock,
  sanity,
};
let warnedUnknownProvider = false;

export function getCms(): CmsProvider {
  const rawKey = process.env.CMS_PROVIDER ?? "mock";
  const key = rawKey.trim().toLowerCase();
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