require("dotenv").config();
const express = require("express");
const port = 8888;
const app = express();
const axios = require("axios");
const querystring = require("querystring");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

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

const stateKey = "spotify_auth_state";

// express app sends message when setup correctly
app.get("/", (req, res) => {});

// handler requests authoriation from spotify
app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email";

  // sets the state and statekey state as a cookie
  res.cookie(stateKey, state);

  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  });

  // appends the necassary parameters the the URL to access spotify.
  // REQUIRED: client_id, response_type, redirect_uri.
  // RECOMENDED: scope, state
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
  //   res.redirect(
  //     `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`
  //   );
});

// Handler uses auth code to requrest access token
// then uses access token to request data from spotify API
app.get("/callback", (req, res) => {
  const code = req.query.code || null;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",

    data: querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
    //Required HTTP headers
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        const { access_token, token_type, refresh_token } = response.data;

        console.log(`token type: ${token_type}`);
        console.log(`access token: ${access_token}`);
        console.log(`refresh token: ${refresh_token}`);
        // for the below get
        // `https://localhost:8888/refresh_token?refresh_token=${refresh_token}`
        //"https://api.spotify.com/v1/me"
        axios
          .get(
            "`https://localhost:8888/refresh_token?refresh_token=${refresh_token}`",
            {
              headers: {
                Authorization: `${token_type} ${access_token}`,
              },
            }
          )
          .then((response) => {
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
  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
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
  console.log(`Express app running at http://localhost:${port}`);
});
