import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    await page.goto('https://antecedentes.policia.gov.co:7005/WebJudicial/antecedentes.xhtml', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Accept Terms
    await page.locator('input[value="true"]').click();
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.locator('#continuarBtn').click()
    ]);
    
    // Get form HTML
    const formHTML = await page.evaluate(() => {
      const f = document.getElementById('formAntecedentes');
      return f ? f.outerHTML : 'Form formAntecedentes not found';
    });
    
    console.log('--- FORM HTML ---');
    console.log(formHTML);
    console.log('--- END FORM HTML ---');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
