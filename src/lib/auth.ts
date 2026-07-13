export function getSiteUrl(requestUrl?: string): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (requestUrl) {
    try {
      return new URL(requestUrl).origin;
    } catch {
      // Ignore and continue with env fallbacks
    }
  }

  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL;

  if (!fromEnv) {
    return "";
  }

  if (/^https?:\/\//i.test(fromEnv)) {
    return fromEnv;
  }

  return `https://${fromEnv}`;
}

export function getAuthRedirectUrl(
  path = "/auth/callback",
  requestUrl?: string,
) {
  const siteUrl = getSiteUrl(requestUrl);
  if (!siteUrl) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
