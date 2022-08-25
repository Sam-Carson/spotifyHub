require("dotenv").config();

const express = require("express");
const port = 3000;
const app = express();
const axios = require("axios");
const querystring = require("querystring");

// using dotenv (npm module), these values are read from the .env file
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const stateKey = "spotify_auth_state";

console.log(CLIENT_ID);
console.log(CLIENT_SECRET);
console.log(REDIRECT_URI);

/**  Geneates a random string containing numbers and letters
 * @param { number } length the length of the string
 * @return { string } the generated string
 */

const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// express app sends message when setup correctly
app.get("/", (req, res) => {
  data = {
    name: "Sam",
    last: "Carson",
  };
  res.send(data);
});

// handler requests authorization from spotify
app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email";

  res.cookie(stateKey, state);

  const usp = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: state,
  });
  const uspString = usp.toString();
  console.log(usp);

  res.redirect(`https://accounts.spotify.com/authorize?${uspString}`);
});

// Handler uses auth code to requrest access token
// then uses access token to request data from spotify API
app.get("/callback", (req, res) => {
  const code = req.query.code || null;
  // const state = req.query.state || null;

  const usp = new URLSearchParams({
    code: code,
    // state: state,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  }).toString();

  console.log("Here is the callback");
  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: usp,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      console.log(response.data);
      console.log(response.status);
      if (response.status === 200) {
        const { access_token, token_type } = response.data;
        axios
          .get("https://api.spotify.com/v1/me", {
            headers: {
              Authorization: `${token_type} ${access_token}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
          })
          .catch((error) => {
            res.send(error);
          });
      } else {
        res.send(response);
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

// Handler requests an access token
app.get("/refresh_token", (req, res) => {
  const { refresh_token } = req.query;
  const usp = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  }).toString();

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: usp,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
});

// declares what port Express is using
app.listen(port, () => {
  console.log(`Express app running at https://localhost:${port}`);
});
