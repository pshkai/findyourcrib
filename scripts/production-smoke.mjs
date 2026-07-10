const DEFAULT_TIMEOUT_MS = 10000;

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  printHelp();
  process.exit(0);
}

const frontendUrl = normalizeOrigin(process.env.FRONTEND_URL ?? process.env.NEXT_PUBLIC_SITE_URL);
const backendUrl = normalizeBackendUrl(process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL);
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);

if (!frontendUrl || !backendUrl) {
  console.error("Missing required smoke URLs.");
  printHelp();
  process.exit(1);
}

if (!Number.isFinite(timeoutMs) || timeoutMs < 1000) {
  console.error("SMOKE_TIMEOUT_MS must be a number greater than or equal to 1000.");
  process.exit(1);
}

const checks = [
  {
    label: "frontend home",
    url: new URL("/", frontendUrl).toString(),
    expectText: "FindYourCrib"
  },
  {
    label: "frontend property search",
    url: new URL("/properties?query=Bangkok", frontendUrl).toString(),
    expectText: "Bangkok"
  },
  {
    label: "frontend robots",
    url: new URL("/robots.txt", frontendUrl).toString(),
    expectText: "User-agent"
  },
  {
    label: "backend liveness",
    url: joinUrl(backendUrl, "health"),
    expectJson: true
  },
  {
    label: "backend readiness",
    url: joinUrl(backendUrl, "health/ready"),
    expectJson: true
  }
];

const results = [];

for (const check of checks) {
  results.push(await runCheck(check, timeoutMs));
}

const failures = results.filter((result) => !result.ok);

for (const result of results) {
  const marker = result.ok ? "PASS" : "FAIL";
  const duration = `${result.durationMs}ms`;
  console.log(`${marker} ${result.label} ${result.status ?? "ERR"} ${duration}`);

  if (!result.ok) {
    console.log(`  ${result.message}`);
    console.log(`  ${result.url}`);
  }
}

if (failures.length) {
  console.error(`Production smoke failed: ${failures.length}/${results.length} checks failed.`);
  process.exit(1);
}

console.log(`Production smoke passed: ${results.length}/${results.length} checks passed.`);

async function runCheck(check, requestTimeoutMs) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(check.url, {
      headers: { Accept: check.expectJson ? "application/json" : "text/html,text/plain" },
      redirect: "follow",
      signal: controller.signal
    });
    const contentType = response.headers.get("content-type") ?? "";
    const body = await response.text();

    if (!response.ok) {
      return failure(check, startedAt, response.status, `Expected 2xx response, received ${response.status}.`);
    }

    if (check.expectJson && !contentType.includes("application/json")) {
      return failure(check, startedAt, response.status, `Expected JSON response, received content-type '${contentType || "unknown"}'.`);
    }

    if (check.expectJson) {
      try {
        JSON.parse(body);
      } catch {
        return failure(check, startedAt, response.status, "Expected valid JSON response.");
      }
    }

    if (check.expectText && !body.toLowerCase().includes(check.expectText.toLowerCase())) {
      return failure(check, startedAt, response.status, `Expected response body to include '${check.expectText}'.`);
    }

    return {
      durationMs: Date.now() - startedAt,
      label: check.label,
      ok: true,
      status: response.status,
      url: check.url
    };
  } catch (error) {
    const isAbort = error instanceof Error && error.name === "AbortError";
    return failure(check, startedAt, undefined, isAbort ? `Timed out after ${requestTimeoutMs}ms.` : errorMessage(error));
  } finally {
    clearTimeout(timeout);
  }
}

function failure(check, startedAt, status, message) {
  return {
    durationMs: Date.now() - startedAt,
    label: check.label,
    message,
    ok: false,
    status,
    url: check.url
  };
}

function normalizeOrigin(value) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return null;
  }
}

function normalizeBackendUrl(value) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    const path = url.pathname.replace(/\/$/, "");
    url.pathname = path.endsWith("/api/v1") ? path : `${path}/api/v1`;
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function joinUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function errorMessage(error) {
  return error instanceof Error ? error.message : "Unknown request error.";
}

function printHelp() {
  console.log(`
Run deployed FindYourCrib smoke checks.

Required environment:
  FRONTEND_URL=https://your-vercel-app.vercel.app
  BACKEND_URL=https://your-render-api.onrender.com

Also accepted:
  NEXT_PUBLIC_SITE_URL instead of FRONTEND_URL
  NEXT_PUBLIC_API_URL instead of BACKEND_URL

Optional:
  SMOKE_TIMEOUT_MS=10000

Example:
  FRONTEND_URL=https://findyourcrib.com BACKEND_URL=https://findyourcrib-api.onrender.com npm run smoke:production
`.trim());
}
