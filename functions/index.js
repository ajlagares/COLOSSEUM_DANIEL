// const {onCall} = require("firebase-functions/v2/https");
// const {onDocumentWritten} = require("firebase-functions/v2/firestore");

const { onRequest } = require("firebase-functions/v2/https");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

exports.scrapeData = onRequest({ memory: '2GiB', cors: true }, async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto('https://www.leagueofgraphs.com/summoner/na/Kim%20Dong%20Dan-NA1', { waitUntil: "domcontentloaded" });
    const pageTitle = await page.title();

    await page.waitForSelector("#mainContent > div.row > div.medium-13.small-24.columns > div:nth-child(5) > table > tbody > tr:nth-child(3) > td.resultCellLight.text-center > a > div.gameDate.requireTooltip");
    await page.hover("#mainContent > div.row > div.medium-13.small-24.columns > div:nth-child(5) > table > tbody > tr:nth-child(3) > td.resultCellLight.text-center > a > div.gameDate.requireTooltip")
    //await page.waitForSelector('#tooltip', { visible: true });

    const gameTimestamp = await page.$("#tooltip");
    const gameResult = await page.$("#mainContent > div.row > div.medium-13.small-24.columns > div:nth-child(5) > table > tbody > tr:nth-child(3) > td.resultCellLight.text-center > a > div.victoryDefeatText.defeat");

    const gameTimestampText = await page.evaluate(el => el.textContent, gameTimestamp);
    const gameResultText = await page.evaluate(el => el.textContent, gameResult);
    
    let removeGameTime = await gameTimestampText.split(' - ')[0]
    //const date = new Date(removeGameTime);
    //let convertToUTC = date.toISOString()

    res.status(200).send({ title: pageTitle, lastgameResult: gameResultText, lastMatchTimestamp: removeGameTime});
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).send('Error scraping data');
  }
  finally {
    await browser.close();
  }
});