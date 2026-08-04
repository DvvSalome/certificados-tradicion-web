import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser to check cookies...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    console.log('Navigating to index...');
    await page.goto('https://antecedentes.policia.gov.co:7005/WebJudicial/antecedentes.xhtml', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    let cookies = await context.cookies();
    console.log('Cookies initially:', JSON.stringify(cookies, null, 2));

    console.log('Accepting terms...');
    await page.locator('input[value="true"]').click();
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.locator('#continuarBtn').click()
    ]);
    
    cookies = await context.cookies();
    console.log('Cookies after accepting terms:', JSON.stringify(cookies, null, 2));

  } catch (error) {
    console.error('Error during cookie extraction:', error);
  } finally {
    await browser.close();
  }
})();
