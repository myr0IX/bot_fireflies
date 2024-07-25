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
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(process.env.URL);
  console.log('Page loaded');
  await waitAndClick(page, '.sc-89bbe6bd-1.hkiMRa.defaultOutline.lg.leading');

  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', process.env.EMAIL);
  await waitAndClick(page, '#identifierNext > div > button');

  await page.waitForSelector('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input');
  console.log('Password input found');
  await sleep(2000);
  await page.type('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', process.env.PASSWORD);

  await waitAndClick(page, '#passwordNext > div > button');
  await waitAndClick(page, '#yDmH0d > c-wiz > div > div.JYXaTc.F8PBrb > div > div > div:nth-child(2) > div > div > button');
  await waitAndClick(page, '#submit_approve_access > div > button');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  console.log('Logged in');
  await waitAndClick(page, '#share-modal-close-btn');
  // await page.click();
  console.log('Closed share modal');
  // if (await page.$('#__next > div.sc-a335c446-0.kGeoYy > div.sc-a335c446-2.iMEKCc > div.sc-fbee6e87-0.ifISjB > div.sc-a335c446-4.hvzNDA.body-section-content.body-section-content-transcriptContent > div > div.sc-2c87a363-2.kNwLDp > div > div > div > div > div > div > div.sc-9fad574a-0.inszNw')) {
    //   await waitAndClick(page, '#submit_approve_access > div > button');
    // }
    await page.waitForSelector('div[class="sc-9fad574a-0 inszNw"]');
    const divText = await page.evaluate(() => {
      // Remplacez '#my-div' par le sélecteur de la div dont vous voulez extraire le texte
      const element = document.querySelector('div[class="sc-9fad574a-0 inszNw"]');
      return element ? element.innerText : 'Aucun texte trouvé';
    });
    
    // Enregistrer le texte dans un fichier texte
    fs.writeFileSync('divText.txt', divText);
    await browser.close();
    // await sleep(500000);
  })();