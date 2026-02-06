const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3002');
  
  // Wait for content to load
  await page.waitForTimeout(2000);
  
  // Test: Add a new task to Backlog
  const addButton = await page.locator('text=📋 Backlog').locator('..').locator('button[title="Add task"]');
  await addButton.click();
  await page.waitForTimeout(500);
  
  await page.fill('textarea', 'Test new task added via dashboard');
  await page.click('button:has-text("Add Task")');
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: 'dashboard-with-new-task.png', fullPage: true });
  
  console.log('Screenshot with new task saved!');
  
  await browser.close();
})();
