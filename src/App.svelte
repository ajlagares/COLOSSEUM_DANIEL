<script>
  //🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  //Import firebase code
  import { initializeApp } from "firebase/app";
  import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { getFunctions, httpsCallable } from "firebase/functions";

  const firebaseConfig = {
    apiKey: "AIzaSyCcUIXPORf5C_PEDsTYPadaTgGtzSky7kY",
    authDomain: "colosseum-9dc60.firebaseapp.com",
    projectId: "colosseum-9dc60",
    storageBucket: "colosseum-9dc60.appspot.com",
    messagingSenderId: "725055635794",
    appId: "1:725055635794:web:b50c9c8ca61d6d85ecfa8b",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const functions = getFunctions(app);
  let user = null;
  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      user = result.user;
      console.log("User info:", user);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  }
  //🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  let summonerName = "";
  $: summonerNameWithSpaces = summonerName.replace(/ /g, "%20");
  let summonerRegion = "";
  let summonerTag = "";
  let midStatus = "normal";
  let loggedInStatus = 2;
  function fetchGameData() {}

  function verifyBetData() {}
</script>

<main>
  <div class="container">
    <div
      class="top"
      style="flex-direction:row; justify-content: space-between; align-items:center; padding:0.5rem;"
    >
      {#if user === null}
        <img style="height:70px; width:140px;" /><button
          on:click={loginWithGoogle}>Log in</button
        >
      {:else}
        you are logged in!
      {/if}
    </div>

    <div class="mid">
      {#if midStatus === "normal"}
        <div
          class="cardRow1"
          style="flex-direction:row; justify-content: space-between; align-items:center; padding:0.5rem; gap:0.5rem;"
        >
          <div class="testCard">
            <img style="height:100px; width:100px;" />1.Select a summoner and
            place a bet on them winning their next match.
          </div>
          <div class="testCard">
            <img style="height:100px; width:100px;" />2.Play/watch the match.
            Winners double their points.
          </div>
          <div class="testCard">
            <img style="height:100px; width:100px;" />3.Top 3 of the week get a
            free skin
          </div>
          <div class="testCard">
            <img style="height:100px; width:100px;" />4.Points refresh every
            day!
          </div>
        </div>

        <div
          class="summoningRow2"
          style="background-color: var(--blue5);  align-items:center;"
        >
          <p>Select a summoner:</p>
          <div style="flex-direction: row; align-items:center;">
            <input
              type="text"
              bind:value={summonerName}
              placeholder="Summoner Name"
            />
          </div>
          <div style="flex-direction: row; align-items:center;">
           
            <select name="region" id="regionSelector" bind:value={summonerRegion}>
              <option value="na">North Amnerica</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              <option value="na">NA</option>
              BR
              EUNE
              EUW
              JP
              KR
              LAN
              LAS
              ME
              NA
              OCE
              RU
              TR
              PH
              SG
              TH
              TW
              VN
            </select>

          </div>
          <div style="flex-direction: row; align-items:center;">
            <input
              type="text"
              bind:value={summonerTag}
              placeholder="Summoner Tag"
            />
          </div>

          <div style="flex-direction: row; align-items:center;">
            <p>
              <a
                target="_blank"
                href="https://www.leagueofgraphs.com/summoner/{summonerRegion}/{summonerNameWithSpaces}-{summonerTag}"
                >Summoner Not found</a
              >
            </p>

            <div
              style="background-color:red; width:20px; height:20px; border-radius:100px; margin:0.5rem;"
            ></div>
          </div>
          <input type="number" placeholder="Bet amount" />
          <br />
          <button on:click={verifyBetData} disabled>Submit Bet</button>
          <br />
        </div>

        <div id="BetHistoryBox">
          <div id="BetHistoryLog">bet history</div>
          <div id="BetHistoryLog">bet history</div>
          <div id="BetHistoryLog">bet history</div>
          <div id="BetHistoryLog">bet history</div>
          <div id="BetHistoryLog">bet history</div>
          <div id="BetHistoryLog">bet history</div>
          <div id="BetHistoryLog">bet history</div>
        </div>
        <div class="betHistoryRow3"></div>
      {:else if midStatus === "contact"}
        hey here is my email
      {:else if midStatus === "about"}
        We are some cool dudes
      {/if}
    </div>

    <div class="right">
      LeaderBoard / Todo: <br />1. Finish setting up serveside function for
      scraping last match data <br />2. Pass data from scrape to firestore
      document. <br />3.
    </div>

    <div
      class="bot"
      style="flex-direction:row; justify-content: space-evenly; align-items:center;"
    >
      <button
        on:click={() => {
          midStatus = "normal";
        }}>Home</button
      >
      <button
        on:click={() => {
          midStatus = "about";
        }}>About us</button
      >
      <button
        on:click={() => {
          midStatus = "contact";
        }}>Contact</button
      >
    </div>
  </div>
</main>
