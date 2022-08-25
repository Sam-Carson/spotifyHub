const axios = require("axios");

// Map for local storage
const LOCALSTORAGE_KEYS = {
  access_token: "spotify_access_token",
  refresh_token: "spotify_refresh_token",
  expires_in: "spotify_token_expires_in",
  time_stamp: "spotify_token_time_stamp",
};

const LOCALSTORAGE_VALUES = {
  access_token: window.localStorage.getItem(LOCALSTORAGE_KEYS.access_token),
  refresh_token: window.localStorage.getItem(LOCALSTORAGE_KEYS.refresh_token),
  expires_in: window.localStorage.getItem(LOCALSTORAGE_KEYS.expires_in),
  time_stamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.time_stamp),
};

/**
 * Handles logic for retrieving the Spotify access token from localStorage
 * or URL query params
 * @returns {string} A Spotify access token
 */
// Map to retrieve localStorage values
const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.access_token]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refresh_token]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expires_in]: urlParams.get("expires_in"),
  };
  const hasError = urlParams.get("error");

  // If there's an error OR the token in localStorage has expired, refresh the token
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.access_token === "undefined"
  ) {
    refreshToken();
  }

  // If there is a valid access token in localStorage, use that
  if (
    LOCALSTORAGE_VALUES.access_token &&
    LOCALSTORAGE_VALUES.access_token !== "undefined"
  ) {
    return LOCALSTORAGE_VALUES.access_token;
  }

  // If there is a token in the URL query params, user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.access_token]) {
    // Store the query params in localStorage
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
    // Set timestamp
    window.localStorage.setItem(LOCALSTORAGE_KEYS.time_stamp, Date.now());
    // Return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.access_token];
  }

  // We should never get here!
  return false;
};

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
const hasTokenExpired = () => {
  const { access_token, time_stamp, expires_in } = LOCALSTORAGE_VALUES;
  if (!access_token || !time_stamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(time_stamp);
  return millisecondsElapsed / 1000 > Number(expires_in);
};

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
const refreshToken = async () => {
  try {
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (
      !LOCALSTORAGE_VALUES.refresh_token ||
      LOCALSTORAGE_VALUES.refresh_token === "undefined" ||
      Date.now() - Number(LOCALSTORAGE_VALUES.time_stamp) / 1000 < 1000
    ) {
      console.error("No refresh token available");
      logout();
    }

    // Use `/refresh_token` endpoint from our Node app
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refresh_token}`
    );

    // Update localStorage values
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.access_token,
      data.access_token
    );
    window.localStorage.setItem(LOCALSTORAGE_KEYS.time_stamp, Date.now());

    // Reload the page for localStorage updates to be reflected
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = () => {
  // Clear all localStorage items
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  // Navigate to homepage
  window.location = window.location.origin;
};

export const access_token = getAccessToken();