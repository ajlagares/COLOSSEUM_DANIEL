const { onCall } = require("firebase-functions/v2/https");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

exports.getSummonerData = onCall({ memory: '4GiB', timeoutSeconds: 2000 }, async (request) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(request.data.text, { waitUntil: "domcontentloaded" });
    const pageTitle = await page.title();

    await page.hover("#mainContent > div.row > div.medium-13.small-24.columns > div:nth-child(5) > table > tbody > tr:nth-child(3) > td.resultCellLight.text-center > a > div.gameDate.requireTooltip")

    const gameTimestamp = await page.$("#tooltip");
    const gameResult = await page.$("#mainContent > div.row > div.medium-13.small-24.columns > div:nth-child(5) > table > tbody > tr:nth-child(3) > td.resultCellLight.text-center > a > div.victoryDefeatText.defeat");

    const gameTimestampText = await page.evaluate(el => el.textContent, gameTimestamp);
    const gameResultText = await page.evaluate(el => el.textContent, gameResult);

    await browser.close();
    return { title: pageTitle, lastgameResult: gameResultText, lastMatchTimestamp: gameTimestampText};
  } catch (error) {

    return ("Unable to locate summoner.");
  }
});