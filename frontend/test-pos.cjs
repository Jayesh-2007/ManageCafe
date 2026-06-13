const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:5173/pos', { waitUntil: 'networkidle0' });
  
  // Wait for products to load
  await page.waitForSelector('h3', { timeout: 5000 });
  
  // Click the first product to add to cart
  const productCards = await page.$$('div.p-3.flex-1.flex.flex-col');
  if (productCards.length > 0) {
    await productCards[0].click();
  } else {
    console.log("No products found");
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Pay button
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text === 'Pay') {
      console.log("Clicking Pay button...");
      await btn.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
