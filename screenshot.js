const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3002');
  
  // Wait for content to load
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'dashboard-screenshot.png', fullPage: true });
  
  console.log('Screenshot saved to dashboard-screenshot.png');
  
  await browser.close();
})();
