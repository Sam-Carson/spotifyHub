import { useEffect, useState } from "react";
import { access_token, logout } from "./spotify";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(access_token);
  }, []);

  // useEffect(() => {
  //   const querystring = window.location.search;
  //   const urlParams = new URLSearchParams(querystring);
  //   const access_token = urlParams.get("access_token");
  //   const refresh_token = urlParams.get("refresh_token");

  //   console.log("ACCESS TOKEN");
  //   console.log(access_token);
  //   console.log("REFRESH TOKEN");
  //   console.log(refresh_token);

  //   if (refresh_token) {
  //     fetch(`/refresh_token?refresh_token=${refresh_token}`)
  //       .then((res) => res.json())
  //       .then((data) => console.log(data))
  //       .catch((err) => console.error(err));
  //   }
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a className="App-link" href="http://localhost:8888/login">
            Log into spotify
          </a>
        ) : (
          <div>
            <h1>logged in</h1>
            <button onClick={logout}>Log Out</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
