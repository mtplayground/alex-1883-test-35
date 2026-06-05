import { chromium } from 'playwright';

const placeholderPatterns = [/DEPLOYMENT READY/i, /Sprite service/i];
const suanpanPatterns = [
  /<title>\s*Suanpan\s*<\/title>/i,
  /\/assets\/[^"']+\.js/i,
];

function parseUrl(value, name) {
  try {
    return new URL(value).toString();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid ${name} "${value}": ${message}`, {
      cause: error,
    });
  }
}

function getTargetUrls() {
  const candidate = process.env.DEPLOYED_URL ?? process.env.SMOKE_BASE_URL;

  if (!candidate) {
    throw new Error(
      'Set DEPLOYED_URL or SMOKE_BASE_URL to the deployed app URL before running the deploy smoke check.',
    );
  }

  const viewedUrl = parseUrl(candidate, 'deployed app URL');
  const viewed = new URL(viewedUrl);
  const publishedUrl =
    process.env.PUBLISHED_URL ??
    new URL(process.env.PUBLISHED_PATH ?? '/', viewed.origin).toString();

  return {
    publishedUrl: parseUrl(publishedUrl, 'published target URL'),
    viewedUrl,
  };
}

function headersToObject(headers) {
  return Object.fromEntries(headers.entries());
}

function classifyServedIdentity(body, headers) {
  const detectedPlaceholder = placeholderPatterns.find((pattern) =>
    pattern.test(body),
  );

  if (detectedPlaceholder) {
    return `platform-owned placeholder (${detectedPlaceholder})`;
  }

  const looksLikeSuanpan = suanpanPatterns.every((pattern) =>
    pattern.test(body),
  );
  if (looksLikeSuanpan) {
    return 'suanpan-vite-build';
  }

  const looksPlatformOwned =
    headers['sprite-version'] !== undefined ||
    (body.includes('src="/app.js"') && body.includes('href="/styles.css"'));
  return looksPlatformOwned ? 'platform-owned page/route' : 'unknown';
}

function assertNoPlaceholder(content, sourceName) {
  const detectedPattern = placeholderPatterns.find((pattern) =>
    pattern.test(content),
  );

  if (detectedPattern) {
    throw new Error(
      `Deploy smoke check failed: ${sourceName} contains placeholder text matching ${detectedPattern}.`,
    );
  }
}

function assertSuanpanIdentity(snapshot) {
  if (snapshot.identity !== 'suanpan-vite-build') {
    throw new Error(
      `Deploy smoke check failed: ${snapshot.label} served ${snapshot.identity} instead of the Suanpan Vite build at ${snapshot.url}.`,
    );
  }
}

async function fetchRawHtml(url, label) {
  const response = await fetch(url, {
    headers: {
      accept: 'text/html',
    },
  });
  const body = await response.text();
  const headers = headersToObject(response.headers);
  const snapshot = {
    body,
    headers,
    identity: classifyServedIdentity(body, headers),
    label,
    status: response.status,
    statusText: response.statusText,
    url,
  };

  console.log(
    `ISSUE_33_RESPONSE label=${label} url=${url} status=${snapshot.status} identity=${JSON.stringify(snapshot.identity)} headers=${JSON.stringify(snapshot.headers)} body=${JSON.stringify(body)}`,
  );

  if (!response.ok) {
    throw new Error(
      `Deploy smoke check failed: GET ${url} returned ${response.status} ${response.statusText}.`,
    );
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('text/html')) {
    throw new Error(
      `Deploy smoke check failed: GET ${url} returned "${contentType}" instead of HTML.`,
    );
  }

  return snapshot;
}

async function assertRenderedAbacus(rootUrl) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(rootUrl, { waitUntil: 'networkidle' });

    const heading = page.getByRole('heading', { name: 'Suanpan' });
    await heading.waitFor({ state: 'visible', timeout: 10_000 });

    const board = page.getByRole('region', {
      name: /Suanpan board with \d+ rods/i,
    });
    await board.waitFor({ state: 'visible', timeout: 10_000 });

    const renderedHtml = await page.content();
    assertNoPlaceholder(renderedHtml, 'rendered root DOM');

    const beadCount = await page
      .getByRole('button', { name: /(?:heaven|earth) bead \d+ neutral/i })
      .count();
    if (beadCount === 0) {
      throw new Error(
        'Deploy smoke check failed: rendered root does not contain abacus bead controls.',
      );
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const { publishedUrl, viewedUrl } = getTargetUrls();
  const viewed = await fetchRawHtml(viewedUrl, 'viewed-url');
  const published =
    publishedUrl === viewedUrl
      ? viewed
      : await fetchRawHtml(publishedUrl, 'published-target');

  console.log(
    `ISSUE_33_MAPPING viewed_url=${viewedUrl} viewed_identity=${JSON.stringify(viewed.identity)} published_url=${publishedUrl} published_identity=${JSON.stringify(published.identity)} corrected_mapping=${JSON.stringify('viewed URL serves Suanpan dist/index.html with assets/')}`,
  );

  assertNoPlaceholder(viewed.body, 'served viewed URL HTML');
  assertNoPlaceholder(published.body, 'served published target HTML');
  assertSuanpanIdentity(viewed);
  assertSuanpanIdentity(published);
  await assertRenderedAbacus(viewedUrl);

  console.log(`Deploy smoke check passed for viewed URL ${viewedUrl}`);
  console.log(
    'ISSUE_34_HUMAN_GATE required=true action="A maintainer must load the live URL and visually confirm Suanpan beads, rods, and readout before any deploy issue is closed."',
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
