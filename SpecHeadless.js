const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
      headless: false
  });
  const page = await browser.newPage();
  await page.goto('file://_SpecRunner.html');
  await page.screenshot({path: 'example.png'});

})();
