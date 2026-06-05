import { chromium } from 'playwright';

const placeholderPatterns = [/DEPLOYMENT READY/i, /Sprite service/i];

function getBaseUrl() {
  const candidate = process.env.DEPLOYED_URL ?? process.env.SMOKE_BASE_URL;

  if (!candidate) {
    throw new Error(
      'Set DEPLOYED_URL or SMOKE_BASE_URL to the deployed app URL before running the deploy smoke check.',
    );
  }

  try {
    return new URL('/', candidate).toString();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid deployed app URL "${candidate}": ${message}`, {
      cause: error,
    });
  }
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

async function fetchRootHtml(rootUrl) {
  const response = await fetch(rootUrl, {
    headers: {
      accept: 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Deploy smoke check failed: GET ${rootUrl} returned ${response.status} ${response.statusText}.`,
    );
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('text/html')) {
    throw new Error(
      `Deploy smoke check failed: GET ${rootUrl} returned "${contentType}" instead of HTML.`,
    );
  }

  return response.text();
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
  const rootUrl = getBaseUrl();
  const rootHtml = await fetchRootHtml(rootUrl);

  assertNoPlaceholder(rootHtml, 'served root HTML');
  await assertRenderedAbacus(rootUrl);

  console.log(`Deploy smoke check passed for ${rootUrl}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
