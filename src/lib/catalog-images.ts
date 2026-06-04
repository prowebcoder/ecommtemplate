/**
 * Stable remote catalog images (picsum.photos seeds).
 * Unsplash hotlinks often 404; these URLs are deterministic and load reliably.
 */
const BASE = "https://picsum.photos/seed";

export function productImage(
  handle: string,
  slot: 1 | 2 = 1,
  width = 800,
  height = 1000
) {
  const seed = slot === 1 ? `veloire-p-${handle}` : `veloire-p2-${handle}`;
  return `${BASE}/${seed}/${width}/${height}`;
}

export function collectionImage(handle: string, width = 1200, height = 800) {
  return `${BASE}/veloire-c-${handle}/${width}/${height}`;
}

export function heroImage(width = 1600, height = 900) {
  return `${BASE}/veloire-hero/${width}/${height}`;
}

export function promoImage(width = 800, height = 600) {
  return `${BASE}/veloire-promo/${width}/${height}`;
}

export function instagramImage(index: number, width = 400, height = 400) {
  return `${BASE}/veloire-ig-${index}/${width}/${height}`;
}

export function navImage(key: string, width = 600, height = 400) {
  return `${BASE}/veloire-nav-${key}/${width}/${height}`;
}

const LEGACY_IMAGE_HOSTS = ["images.unsplash.com", "plus.unsplash.com"];

/** Rewrite broken/legacy Unsplash URLs to stable picsum seeds. */
export function normalizeProductImageUrl(
  url: string | undefined | null,
  handle?: string,
  width = 800,
  height = 1000
): string {
  if (!url) {
    return productImage(handle ?? "placeholder", 1, width, height);
  }
  try {
    const host = new URL(url).hostname;
    if (LEGACY_IMAGE_HOSTS.includes(host)) {
      return productImage(handle ?? "placeholder", 1, width, height);
    }
  } catch {
    return productImage(handle ?? "placeholder", 1, width, height);
  }
  return url;
}

/** Normalize images on stored orders (legacy Unsplash URLs in localStorage). */
export function normalizeOrderItemImage(item: {
  image: string;
  handle?: string;
}) {
  return normalizeProductImageUrl(item.image, item.handle, 160, 192);
}
