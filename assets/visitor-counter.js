// The public endpoint used by Busuanzi's official 3.6.9 client:
// https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js
// Counts are stored by the service for the website, not in this browser.
const endpoint = "https://cdn.busuanzi.cc/api.php";
let pendingCounts;

export function loadVisitorCounts() {
  // Preview visits must not contribute to the published website's statistics.
  if (location.hostname !== "gentlefress.github.io") {
    return Promise.resolve(null);
  }

  // The shared layout and profile sidebar use the same request, including
  // when the sidebar is mounted again after navigating back to the homepage.
  if (!pendingCounts) {
    pendingCounts = requestCounts().catch((error) => {
      pendingCounts = undefined;
      throw error;
    });
  }
  return pendingCounts;
}

async function requestCounts() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      // Match the official client's simple CORS request format.
      body: JSON.stringify({ url: location.href, referrer: document.referrer }),
      credentials: "omit",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Visitor statistics are unavailable");

    const data = await response.json();
    const today = parseCount(data.busuanzi_today_uv);
    const total = parseCount(data.busuanzi_site_uv);
    if (total < today) throw new Error("Inconsistent visitor statistics");
    return { today, total };
  } finally {
    clearTimeout(timeout);
  }
}

function parseCount(value) {
  if (typeof value !== "number" &&
      !(typeof value === "string" && /^\d+$/.test(value))) {
    throw new Error("Invalid visitor statistics");
  }
  const count = Number(value);
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error("Invalid visitor statistics");
  }
  return count;
}
