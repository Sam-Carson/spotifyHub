import logo from "./logo.svg";
import { useEffect } from "react";

import "./App.css";

function App() {
  useEffect(() => {
    const querystring = window.location.search;
    const urlParams = new URLSearchParams(querystring);
    const access_token = urlParams.get("access_token");
    const refresh_token = urlParams.get("refresh_token");

    console.log("ACCESS TOKEN");
    console.log(access_token);
    console.log("REFRESH TOKEN");
    console.log(refresh_token);

    if (refresh_token) {
      fetch(`/refresh_token?refresh_token=${refresh_token}`)
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <a className="App-link" href="http://localhost:8888/login">
          Log into spotify
        </a>
      </header>
    </div>
  );
}

export default App;
