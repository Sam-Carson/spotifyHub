import { useEffect, useState } from "react";
import { access_token, logout, getCurrentUserProfile } from "./spotify";
import { catchErrors } from "./utils";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(access_token);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    };
    catchErrors(fetchData());
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a className="App-link" href="http://localhost:8888/login">
            Log into spotify
          </a>
        ) : (
          <div>
            {profile && (
              <div>
                <h1>Logged in</h1>
                <button onClick={logout}>Log out</button>
                <h1>{profile.display_name}</h1>
                <p>{profile.followers.total} Followers</p>
                {profile.images.length && profile.images[0].url && (
                  <img src={profile.images[0].url} alt="Sam" />
                )}
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
