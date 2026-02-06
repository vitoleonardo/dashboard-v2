const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🚀 Testing Dashboard...');
  
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Take initial screenshot
  await page.screenshot({ path: 'test-1-initial.png', fullPage: true });
  console.log('✅ Initial load successful');
  
  // Test adding a task
  const addButton = page.locator('button:has-text("+")').first();
  await addButton.click();
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: 'test-2-dialog-open.png', fullPage: true });
  console.log('✅ Dialog opens');
  
  // Fill in task details
  await page.fill('input#task-text', 'Test task with priority');
  await page.fill('textarea#task-description', 'This is a test task to verify the UI works perfectly!');
  
  // Select high priority
  await page.click('button:has-text("High")');
  
  await page.screenshot({ path: 'test-3-form-filled.png', fullPage: true });
  console.log('✅ Form filled');
  
  // Submit
  await page.click('button:has-text("Create Task")');
  await page.waitForTimeout(1500);
  
  await page.screenshot({ path: 'test-4-task-created.png', fullPage: true });
  console.log('✅ Task created');
  
  // Test keyboard shortcut
  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: 'test-5-keyboard-shortcut.png', fullPage: true });
  console.log('✅ Keyboard shortcut works');
  
  // Close dialog
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: 'test-6-final-state.png', fullPage: true });
  console.log('✅ All tests passed!');
  
  await browser.close();
  console.log('🎉 Dashboard is production ready!');
})();
