const rawTarget = process.argv[2] ?? process.env.DEPLOYMENT_URL;

if (!rawTarget) {
  console.error(
    "Usage: npm run verify:deployment -- https://your-deployment.example\n" +
      "or set DEPLOYMENT_URL.",
  );
  process.exit(1);
}

let baseUrl;
try {
  baseUrl = new URL(rawTarget);
} catch {
  console.error(`Invalid deployment URL: ${rawTarget}`);
  process.exit(1);
}

if (!["http:", "https:"].includes(baseUrl.protocol)) {
  console.error("Deployment URL must use http or https.");
  process.exit(1);
}

baseUrl.pathname = "/";
baseUrl.search = "";
baseUrl.hash = "";

const REQUEST_TIMEOUT_MS = 10_000;

const publicRoutes = ["/", "/about", "/experience", "/projects", "/resume", "/updates", "/contact"];

function urlFor(pathname) {
  return new URL(pathname, baseUrl).toString();
}

async function request(pathname) {
  const response = await fetch(urlFor(pathname), {
    redirect: "follow",
    headers: {
      Accept: "application/json, text/html;q=0.9, */*;q=0.8",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  return response;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function verifyHealth() {
  const response = await request("/api/health");
  assert(response.status === 200, `/api/health returned ${response.status}`);
  assert(
    response.headers.get("cache-control")?.includes("no-store"),
    "/api/health must use Cache-Control: no-store",
  );

  const body = await response.json();
  assert(body.status === "ok", "/api/health did not report status=ok");
  assert(body.service === "portfolio-web", "/api/health returned an unexpected service name");

  const serialized = JSON.stringify(body);
  assert(
    !/password|secret|token|databaseurl/i.test(serialized),
    "/api/health exposed a potentially sensitive field",
  );

  console.log("✓ liveness");
}

async function verifyReadiness() {
  const response = await request("/api/health/ready");
  assert(response.status === 200, `/api/health/ready returned ${response.status}`);
  assert(
    response.headers.get("cache-control")?.includes("no-store"),
    "/api/health/ready must use Cache-Control: no-store",
  );

  const body = await response.json();
  assert(body.status === "ready", "/api/health/ready did not report status=ready");
  assert(body.checks?.database === "ok", "/api/health/ready did not report database=ok");

  console.log("✓ readiness");
}

async function verifyPublicRoutes() {
  for (const route of publicRoutes) {
    const response = await request(route);
    assert(response.status === 200, `${route} returned ${response.status}`);
  }

  console.log(`✓ public routes (${publicRoutes.length})`);
}

async function verifyNotFound() {
  const response = await request("/__deployment_verification_missing_route__");
  assert(response.status === 404, `unknown route returned ${response.status}, expected 404`);

  console.log("✓ application 404");
}

async function main() {
  console.log(`Verifying deployment: ${baseUrl.origin}`);

  await verifyHealth();
  await verifyReadiness();
  await verifyPublicRoutes();
  await verifyNotFound();

  console.log("✓ deployment verification passed");
}

main().catch((error) => {
  console.error(`✗ deployment verification failed: ${error.message}`);
  process.exit(1);
});
