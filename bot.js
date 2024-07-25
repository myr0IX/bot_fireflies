require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitAndClick(page, selector) {
	await sleep(2000);
	await page.waitForSelector(selector);
  await page.click(selector);
	// console.log('Clicked on ' + selector);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--lang=en-US']
  });
  // const browser = await puppeteer.launch({
  //   args: ['--lang=en-US']
  // });
  const page = await browser.newPage();
  await page.goto(process.env.URL);
  console.log('Page loaded');
  // await page.screenshot({ path: 'screenshot1.png', fullPage: true });
  await waitAndClick(page, '.sc-89bbe6bd-1.hkiMRa.defaultOutline.lg.leading');

  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', process.env.EMAIL);
  console.log('Email entered');
  // await page.screenshot({ path: 'screenshot2.png', fullPage: true });
  await sleep(1000);
  await waitAndClick(page, '#identifierNext > div > button');

  await page.waitForSelector('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input');
  await sleep(2000);
  await page.type('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', process.env.PASSWORD);
  console.log('Password entered');
  console.log('Logged in');
  
  await waitAndClick(page, '#passwordNext > div > button');
  await waitAndClick(page, '#yDmH0d > c-wiz > div > div.JYXaTc.F8PBrb > div > div > div:nth-child(2) > div > div > button');
  await waitAndClick(page, '#submit_approve_access > div > button');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await waitAndClick(page, '#share-modal-close-btn');

  await page.waitForSelector('div[class="sc-9fad574a-0 inszNw"]');
  const divText = await page.evaluate(() => {
    const messageElements = document.querySelectorAll('div[class="sc-9fad574a-0 inszNw"] div[class="sc-9fad574a-0 sc-5f491930-0 kVSUYz ARwle paragraph-root"]');
    return Array.from(messageElements).map(message => {
      const nameElement = message.querySelector('.name');
      const textElement = message.querySelector('div[class="sc-5f491930-1 hACLGV transcript-sentence"]');
      
      return {
        name: nameElement ? nameElement.innerText.trim() : '',
        text: textElement ? textElement.innerText.trim() : ''
      };
    });
  });
  const data = {
    transcript: divText
  };

  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync('transcript.json', json);
  console.log('Transcript saved');
  await browser.close();
  })();