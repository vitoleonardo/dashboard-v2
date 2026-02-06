const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'current-state.png', fullPage: true });
  console.log('Screenshot saved!');
  
  await browser.close();
})();
