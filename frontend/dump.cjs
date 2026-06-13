const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set localStorage to bypass login
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, role: 'admin' }));
  });
  
  await page.goto('http://localhost:5173/pos', { waitUntil: 'networkidle0' });
  
  // Wait for products
  await page.waitForSelector('.group.flex.flex-col', { timeout: 10000 });
  
  // Click first product
  const products = await page.$$('.group.flex.flex-col');
  await products[0].click();
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Pay button
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Pay')) {
      await btn.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Dump the HTML
  const html = await page.evaluate(() => document.body.innerHTML);
  const fs = require('fs');
  fs.writeFileSync('dom_dump.html', html);
  
  await browser.close();
})();
