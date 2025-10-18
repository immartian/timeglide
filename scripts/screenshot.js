#!/usr/bin/env node
/* Generate a demo screenshot and do a basic smoke test */
const fs = require('fs');
const path = require('path');

async function main() {
  const { chromium } = require('playwright');
  const url = process.env.URL || 'http://127.0.0.1:8000/index.html';
  const outDir = path.resolve(process.cwd(), 'artifacts');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();

  await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForSelector('h1');

  // Smoke-test: component renders and shows a formatted date inside shadow DOM
  await page.waitForFunction(() => {
    const host = document.querySelector('#demo1');
    if (!host) return false;
    const root = host.shadowRoot || host;
    const el = root.querySelector('.tg-selected-date');
    return !!(el && /\d{1,2}\s[A-Z][a-z]{2}\s\d{4}/.test(el.textContent || ''));
  }, { timeout: 20_000 });

  // Interact: click Light theme button to ensure toolbar works (if present)
  const lightBtn = page.locator('[data-theme="light"]');
  if (await lightBtn.count()) {
    await lightBtn.first().click();
  }

  const outFile = path.join(outDir, 'screenshot.png');
  await page.screenshot({ path: outFile, fullPage: true });

  console.log('Screenshot saved to', outFile);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

