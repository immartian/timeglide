#!/usr/bin/env node
/* Generate demo screenshots and do a basic smoke test with Playwright */
const fs = require('fs');
const path = require('path');

async function main() {
  const { chromium } = require('playwright');
  const url = process.env.URL || 'http://127.0.0.1:8000/index.html';
  const outDir = process.env.OUT_DIR ? path.resolve(process.cwd(), process.env.OUT_DIR) : path.resolve(process.cwd(), 'artifacts');
  const outFile = process.env.OUT_FILE ? path.resolve(process.cwd(), process.env.OUT_FILE) : null;
  const comp1 = process.env.COMP1_SELECTOR || '#demo1';
  const comp2 = process.env.COMP2_SELECTOR || '#demo2';
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

  // Drag the first component's slider to ~75%
  const slider = page.locator(comp1).locator('.tg-slider');
  const box = await slider.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2, { steps: 10 });
    await page.mouse.up();
  }

  if (outFile) {
    // If an explicit file is requested, capture the first component only
    await page.locator(comp1).screenshot({ path: outFile });
    console.log('Screenshot saved to', outFile);
  } else {
    // Dark theme and capture second component (10-year range)
    const darkBtn = page.locator('[data-theme="dark"]');
    if (await darkBtn.count()) await darkBtn.first().click();
    const darkFile = path.join(outDir, 'component-dark-10yr.png');
    // Drag the second component a bit
    const slider2 = page.locator(comp2).locator('.tg-slider');
    const box2 = await slider2.boundingBox();
    if (box2) {
      await page.mouse.move(box2.x + box2.width * 0.20, box2.y + box2.height / 2);
      await page.mouse.down();
      await page.mouse.move(box2.x + box2.width * 0.60, box2.y + box2.height / 2, { steps: 8 });
      await page.mouse.up();
    }
    await page.locator(comp2).screenshot({ path: darkFile });
    console.log('Screenshot saved to', darkFile);

    // Light theme and capture first component
    const lightBtn = page.locator('[data-theme="light"]');
    if (await lightBtn.count()) await lightBtn.first().click();
    const lightFile = path.join(outDir, 'component-light.png');
    await page.locator(comp1).screenshot({ path: lightFile });
    console.log('Screenshot saved to', lightFile);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
