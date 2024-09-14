const { onRequest } = require('firebase-functions/v2/https');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

//for cors use the url you are requesting from
exports.scrapeSummonerData = onRequest({ cors: ['https://www.colosseum.fun', 'https://colosseum.fun', "https://colosseum-9dc60.web.app"], memory: '4GiB', timeoutSeconds: 3600 }, async (request, res) => {
  const receivedURL = request.body.data;
  const delimiter = " - ";

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(receivedURL, { waitUntil: "domcontentloaded" });
  const pageTitle = await page.title();
  const pageTitleD = await pageTitle.split(delimiter)[0];

  await page.hover("#mainContent > div.row > div.medium-13.small-24.columns > div:nth-child(5) > table > tbody > tr:nth-child(3) > td.resultCellLight.text-center > a > div.gameDate.requireTooltip")
  const gameTimestamp = await page.$("#tooltip");
  const gameTimestampText = await page.evaluate(el => el.textContent, gameTimestamp);
  const gameTimestampD = await gameTimestampText.split(delimiter)[0];

  const gameResult = await page.$("#mainContent > div.row > div.medium-13.small-24.columns > div:nth-child(5) > table > tbody > tr:nth-child(3) > td.resultCellLight.text-center > a > div.victoryDefeatText.defeat");
  const gameResultText = await page.evaluate(el => el.textContent, gameResult);

  await browser.close();

  res.status(200).json({ url: receivedURL , title: pageTitleD , lastMatchTimestamp: gameTimestampD , gameResult : gameResultText})
});


//Do not update firebase-functions past version 5.0.0. Version 6.0.0 breaks this function and theres
//not really any good documentation on how to reimport the auth.user() function. If they ever update it
//documentation should be here https://firebase.google.com/docs/functions/auth-events

// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();

// exports.createUser=functions.auth.user().onCreate((user) => {
//   // Get a reference to the Firestore database
//   const db = admin.firestore();

//   // Create a new document in the 'users' collection
//   const userRef = db.collection('users').doc(user.uid);

//   // Set the document data
//   return userRef.set({
//     displayName: user.displayName,
//     email: user.email,
//     photoURL: user.photoURL,
//     createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     points:1000,
//   });
// });
