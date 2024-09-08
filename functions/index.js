/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { onRequest } = require("firebase-functions/v2/https");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

let lastTimestamp = "Unable to locate time :("


exports.scrapeData = onRequest({ memory: '2GiB', cors: true }, async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto('https://www.leagueofgraphs.com/summoner/na/Kim%20Dong%20Dan-NA1', { waitUntil: "domcontentloaded" });

    const elementSelector = 'gameDate requireTooltip'; 

    const pageTitle = await page.title();
    await browser.close();

    res.status(200).send({ title: pageTitle, lastMatchTimestamp: lastTimestamp, victory: "no" /*allcontent: pageContent*/ });
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).send('Error scraping data');
  }
});