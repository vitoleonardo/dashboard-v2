const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'AFTER.png', fullPage: true });
  console.log('✅ Final screenshot captured!');
  
  await browser.close();
})();
