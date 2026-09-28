const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('api') || url.endsWith('.json') || url.includes('swoc')) {
      console.log('API Request:', url);
    }
  });

  await page.goto('https://bigdata-swoc.rid.go.th/dashboard', { waitUntil: 'networkidle0' });
  await browser.close();
})();
