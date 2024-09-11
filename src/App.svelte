<script>
  //🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  //Import firebase code
  import { initializeApp } from "firebase/app";
  import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut 
  } from "firebase/auth";
  import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
  } from "firebase/firestore";
  import { getFunctions, httpsCallable } from "firebase/functions";

  import { onMount } from "svelte";

  import logo from "./assets/colosseumLogo.svg";

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

  // Sign in with google
  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      user = result.user;
      console.log("User info:", user);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  }
  async function logout() {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      // Additional logic after sign-out (e.g., redirecting the user)
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  //Handle user state already logged in
  onMount(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        user = currentUser;
        console.log("User is already logged in:", user);
        // Perform any additional setup with the authenticated user
      } else {
        user = null;
        console.log("No user is logged in");
      }
    });
  });

  //when a bet is placed update user document

  //🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  let utcTime = "";
  const getSummonerData = httpsCallable(functions, "getSummonerData");
  let lastSummonerData = null;
  let summonerName = "";
  $: summonerNameWithSpaces = summonerName.replace(/ /g, "%20");
  let summonerRegion = "";
  let summonerTag = "";
  let midStatus = "normal";
  let summonerSearchDisable = false;
  $: mergedURL =
    "https://www.leagueofgraphs.com/summoner/" +
    summonerRegion +
    "/" +
    summonerNameWithSpaces +
    "-" +
    summonerTag;

  //https://scrapedata-xxvante5sa-uc.a.run.app/

  function updateUTCTime() {
    const now = new Date();
    // Format the time including milliseconds (HH:MM:SS:ms)
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(now.getUTCMilliseconds()).padStart(3, "0"); // Pads to 3 digits

    // Combine to form the full time string
    utcTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  onMount(() => {
    updateUTCTime(); // Initial call to display immediately
    // Update the time every 50 milliseconds for smooth display of ms
    const interval = setInterval(updateUTCTime, 50);

    // Cleanup function to clear the interval when the component is destroyed
    return () => clearInterval(interval);
  });
</script>

<main>
  <div class="container">
    <div
      class="top"
      style="flex-direction:row; justify-content: space-between; align-items:center; padding:0.5rem;"
    >
      {#if user === null}
        <img alt="Logo" src={logo} style="height:120px; width:140px;" />
        <button on:click={loginWithGoogle}>Log in</button>
      {:else}
        <img alt="Logo" src={logo} style="height:120px; width:140px;" />
        <p>{utcTime}</p>
        <p>Signed in under: {user.email}</p>
        <button on:click={logout}>Log out</button>
      {/if}
    </div>

    <div class="mid">
      {#if midStatus === "normal"}
        <div
          class="cardRow1"
          style="flex-direction:row; justify-content: space-between; align-items:center; padding:0.5rem; gap:0.5rem;"
        >
          <div class="testCard">
            <img
              alt="Forms being filled"
              style="height:100px; width:100px;"
            />1.Select a summoner and place a bet on them winning their next
            match.
          </div>
          <div class="testCard">
            <img
              alt="Guy playing on PC"
              style="height:100px; width:100px;"
            />2.Play/watch the match. Winners double their points.
          </div>
          <div class="testCard">
            <img
              alt="Champions podium"
              style="height:100px; width:100px;"
            />3.Top 3 of the week get a free skin
          </div>
          <div class="testCard">
            <img alt="Hourglass" style="height:100px; width:100px;" />4.Points
            refresh every day!
          </div>
        </div>

        <div
          id="summoningRow2"
          style="background-color: var(--blue5); flex-direction:row; padding:.5rem; gap:.5rem; "
        >
          <div style="align-items:center; flex:1;">
            <p style="font-size:1.7rem;">Select a summoner:</p>
            <input
              id="nameInputField"
              type="text"
              bind:value={summonerName}
              disabled={summonerSearchDisable}
              placeholder="Summoner Name"
            />
            <select
              name="region"
              id="regionInputField"
              placeholder="summonerRegion"
              bind:value={summonerRegion}
              disabled={summonerSearchDisable}
            >
              <option value="na">North America</option>
              <option value="lan">Latin America North</option>
              <option value="las">Latin America South</option>
              <option value="br">Brazil</option>
              <option value="euw">Europe West</option>
              <option value="eune">Europe Nordic & East</option>
              <option value="ru">Russia</option>
              <option value="tr">Turkey</option>
              <option value="me">Middle East</option>
              <option value="oce">Oceania</option>
              <option value="jp">Japan</option>
              <option value="kr">Republic of Korea</option>
              <option value="ph">The Philippines </option>
              <option value="sg">Singapore, Malaysia, & Indonesia</option>
              <option value="tw">Taiwan, Hong Kong, and Macao </option>
              <option value="th">Thailand</option>
              <option value="vn">Vietnam</option>
            </select>
            <input
              id="tagInputField"
              type="text"
              bind:value={summonerTag}
              disabled={summonerSearchDisable}
              placeholder="Summoner Tag"
            />

            <input
              type="number"
              placeholder="Bet amount"
              disabled={summonerSearchDisable}
            />
            <div
              style="flex-direction: row; align-items:center; margin:0.5rem; gap:0.5rem;"
            >
              <button
                disabled={summonerSearchDisable}
                id="summonerSearchFunctionButton"
                style="width: 200px; display:flex; flex-direction:row; justify-content:center; align-items:center; gap:1rem; bottom-margin:100px;"
                on:click={() => {
                  console.log(mergedURL);
                  const spinnerDOMID = document.getElementById("spinner");
                  spinnerDOMID.style.display = "block";
                  getSummonerData({ text: mergedURL }).then((result) => {
                    if (result.data !== "Unable to locate summoner.") {
                      lastSummonerData = result.data;
                      console.log(lastSummonerData);
                      const lightDOMID =
                        document.getElementById("indicatorLight");
                      const summonerButtonText =
                        document.getElementById("summonerButtonText");
                      const summonerSearchBG =
                        document.getElementById("summoningRow2");
                      const betPlaceBG = document.getElementById("betPlaceBG");

                      summonerButtonText.innerText = "Summoner Found";
                      lightDOMID.style.backgroundColor = "green";
                      spinnerDOMID.style.display = "none";

                      summonerSearchBG.style.backgroundColor = "#1E2328";
                      betPlaceBG.style.backgroundColor = "#0A323C";

                      summonerSearchDisable = true;
                    } else {
                      spinnerDOMID.style.display = "none";
                      alert("Unable to locate summoner.");
                    }
                  });
                }}
              >
                <p id="summonerButtonText" style="margin:0px;">
                  Verify Summoner
                </p>
                <div
                  id="indicatorLight"
                  style="background-color:red; width:10px; height:10px; border-radius:5px; flex-direction:column; "
                >
                  <span
                    style="display: none; height:30px; width:30px;"
                    id="spinner"
                    class="loader"
                  ></span>
                </div>
              </button>
            </div>
            <br />
          </div>
        </div>

        <div id="BetHistoryBox3" style="height:100%; padding:.5rem; gap:.5rem;">
          <div
            style="background-color: blue; width:100%; height:60px; border:solid 1px gold; justify-content:center; align-items:center;"
          >
            <p style="font-size:1.7rem; ">Bet History</p>
          </div>
          <div
            style="flex-direction:row; justify-content:space-between; background-color: var(--blue4); width:100%; padding:1rem;"
          >
            <div style="flex:3">asdgfafwefawefwefaweffaefwaef</div>
            <div style="flex:1; text-align: right;">10 Sept 2024</div>
            <div style="flex:1; text-align: right;">+2000</div>
            <div style="flex:1; text-align: right;">Victory</div>
          </div>
          <div
            style="flex-direction:row; justify-content:space-between; background-color: var(--blue4); width:100%; padding:1rem;"
          >
            <div style="flex:3; ">User</div>
            <div style="flex:1; text-align: right;">9 Sept 2024</div>
            <div style="flex:1; text-align: right;">0</div>
            <div style="flex:1; text-align: right;">Remake</div>
          </div>

          <div
            style="flex-direction:row; justify-content:space-between; background-color: var(--blue4); width:100%; padding:1rem;"
          >
            <div style="flex:3; ">User</div>
            <div style="flex:1; text-align: right;">8 Sept 2024</div>
            <div style="flex:1; text-align: right;">-1000</div>
            <div style="flex:1; text-align: right;">loss</div>
          </div>
        </div>
        <div class="betHistoryRow3"></div>
      {:else if midStatus === "contact"}
        hey here is my email
      {:else if midStatus === "about"}
        We are some cool dudes
      {/if}
    </div>

    <div class="right" style="height:100%; gap: .5rem; padding:.5rem;">
      <div
        style="background-color: blue; width:100%; height:60px; border:solid 1px gold; justify-content:center; align-items:center;"
      >
        <p style="font-size:1.7rem; ">Leaderboard</p>
      </div>
      <div
        style="flex-direction:row; justify-content:space-between; background-color: var(--blue4); width:100%; padding:1rem;"
      >
        <div>#1</div>
        <div>User</div>
        <div>5000</div>
      </div>

      <div
        style="flex-direction:row; justify-content:space-between; background-color: var(--blue4); width:100%; padding:1rem;"
      >
        <div>#2</div>
        <div>User</div>
        <div>4500</div>
      </div>
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
