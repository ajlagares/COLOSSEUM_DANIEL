/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
//const puppeteer = require("puppeteer");
const cors = require("cors")({ origin: true });

exports.scrapeData = functions.https.onRequest((req, res) => {
     cors(req, res, async () => {
    //   try {
    //     const browser = await puppeteer.launch({
    //       args: ['--no-sandbox', '--disable-setuid-sandbox'],
    //       headless: true,
    //     });
  
    //     const page = await browser.newPage();
    //     await page.goto('https://www.leagueofgraphs.com/summoner/na/Kim%20Dong%20Dan-NA1');
  
    //     const pageTitle = await page.title();
    //     await browser.close();
  
    //     res.status(200).send({ title: pageTitle });
    //   } catch (error) {
    //     console.error('Error scraping data:', error);
    //     res.status(500).send('Error scraping data');
    //   }
    res.redirect("https://www.google.com/")
    });
  });


// export const ssr = functions
// .runWith({memory:"1GB"})
// .https.onRequest(async (request, response)=>{
//     const browser = await puppeteer.launch({
//         headless: true,
//         args: ['--no-sandbox','--disable-setuid-sandbox']
//     });
//     const page = await browser.newPage()
//     await page.goto('https://www.leagueofgraphs.com/summoner/na/Kim%20Dong%20Dan-NA1', {waitUntil:'networkidle0'})
//     const content = await page.content

//     response.send(content)
// })